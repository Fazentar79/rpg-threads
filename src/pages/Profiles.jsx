import React, { useEffect, useState, useContext, useRef } from "react";
import ConnectedLayout from "../layouts/ConnectedLayout.jsx";
import { threadsDb, usersDb } from "../firebase";
import {
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Messagecard from "../components/Messagecard/Messagecard.jsx";
import ButtonSubscription from "../components/Button/ButtonSubscription.jsx";
import { AuthContext } from "../store/AuthProvider";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ButtonCancel from "../components/Button/ButtonCancel.jsx";

export default function Profiles() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  // States
  const [loading, setLoading] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Refs
  const ref = useRef(null);

  // Functions
  useEffect(() => {
    const fetchUsers = async () => {
      if (loading || !id || !user) return;

      try {
        const userSnapshot = await getDocs(
          query(usersDb, where("userId", "==", id)),
        );

        const profileUserData = userSnapshot.docs[0]?.data();

        const profileUserPseudo = profileUserData?.pseudo;
        const profileUserAvatar = profileUserData?.avatar;
        setPseudo(profileUserPseudo);
        setAvatar(profileUserAvatar);

        const currentUserSnapshot = await getDoc(doc(usersDb, user.uid));
        const currentUserSubscriptions =
          currentUserSnapshot.data().subscriptions || [];
        setSubscribed(currentUserSubscriptions.includes(id));
      } catch (error) {
        console.error("Une erreur est survenue : ", error);
        setLoading(false);
      }
      setLoading(false);
    };

    fetchUsers().then();
  }, [id, user]);

  // Check if the user has an avatar
  useEffect(() => {
    if (avatar) {
      setShowAvatar(true);
    }
  }, [avatar]);

  const fetchUserSubThreads = async () => {
    try {
      const threadsQuery = query(
        threadsDb,
        where("userId", "==", id),
        orderBy("date", "desc"),
      );
      const threadsSnapshot = await getDocs(threadsQuery);
      const threads = threadsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setLoading(false);
      return threads;
    } catch (error) {
      console.error("Une erreur est survenue : ", error);
      setLoading(false);
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["threads"],
    queryFn: fetchUserSubThreads,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error);
    }
  }, [error, isError]);

  // Handle subscription
  const handleSubscription = async () => {
    const userDocRef = doc(usersDb, user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    let subscriptions = userDocSnapshot.data().subscriptions || [];

    if (subscribed) {
      // Unsubscribe
      subscriptions = subscriptions.filter(
        (subscriptionId) => subscriptionId !== id,
      );
      await updateDoc(userDocRef, { subscriptions });
      setSubscribed(false);
      toast("Vous vous êtes désabonné avec succès", { type: "success" });
    } else {
      // Subscribe
      subscriptions.push(id);
      await updateDoc(userDocRef, { subscriptions });
      setSubscribed(true);
      toast("Vous vous êtes abonné avec succès", { type: "success" });
    }
  };

  return (
    <ConnectedLayout>
      <div className="mt-40">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="max-w-3xl m-auto"
        >
          <Link to="/">
            <ButtonCancel>
              <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 12H18M6 12L11 7M6 12L11 17"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonCancel>
          </Link>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: [0.9, 1.04, 0.9, 1] },
            }}
            transition={{
              type: "spring",
            }}
            className="shadow-2xl shadow-black rounded-3xl p-5 m-5 flex flex-col items-center"
          >
            <h1 className="text-3xl text-center font-bold mb-10">
              Profil de {pseudo}
            </h1>
            {showAvatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="w-[200px] h-[200px] rounded-full mb-10 shadow-lg shadow-black"
              />
            ) : (
              <svg
                width="20px"
                height="200px"
                viewBox="0 0 24 24"
                fill="none"
                className="w-[200px] h-[200px] rounded-full mb-10 shadow-lg shadow-black"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5ZM7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM7.45609 16.7264C6.40184 17.1946 6 17.7858 6 18.5C6 18.7236 6.03976 18.8502 6.09728 18.942C6.15483 19.0338 6.29214 19.1893 6.66219 19.3567C7.45312 19.7145 9.01609 20 12 20C14.9839 20 16.5469 19.7145 17.3378 19.3567C17.7079 19.1893 17.8452 19.0338 17.9027 18.942C17.9602 18.8502 18 18.7236 18 18.5C18 17.7858 17.5982 17.1946 16.5439 16.7264C15.4614 16.2458 13.8722 16 12 16C10.1278 16 8.53857 16.2458 7.45609 16.7264ZM6.64442 14.8986C8.09544 14.2542 10.0062 14 12 14C13.9938 14 15.9046 14.2542 17.3556 14.8986C18.8348 15.5554 20 16.7142 20 18.5C20 18.9667 19.9148 19.4978 19.5973 20.0043C19.2798 20.5106 18.7921 20.8939 18.1622 21.1789C16.9531 21.7259 15.0161 22 12 22C8.98391 22 7.04688 21.7259 5.83781 21.1789C5.20786 20.8939 4.72017 20.5106 4.40272 20.0043C4.08524 19.4978 4 18.9667 4 18.5C4 16.7142 5.16516 15.5554 6.64442 14.8986Z"
                  fill="#0F1729"
                />
              </svg>
            )}
            <ButtonSubscription disabled={loading} onClick={handleSubscription}>
              {subscribed ? "Se désabonner" : "s'abonner"}
            </ButtonSubscription>
          </motion.div>
          {isLoading && <div className="text-center">Chargement...</div>}

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            initial="hidden"
            animate="visible"
            className="max-w-7xl m-auto p-5"
          >
            {data?.length === 0 && (
              <div className="text-center mt-10">Aucun thread à afficher</div>
            )}

            {subscribed && (
              <div>
                <h1 className="text-3xl text-center font-bold my-10">
                  Threads du compte
                </h1>
                {data?.map((thread) => (
                  <div key={thread.id} className="m-auto w-full max-w-3xl">
                    <Messagecard
                      key={thread.image}
                      messageRef={ref}
                      threads={thread}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </ConnectedLayout>
  );
}
