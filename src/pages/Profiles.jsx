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
    } else {
      // Subscribe
      subscriptions.push(id);
      await updateDoc(userDocRef, { subscriptions });
      setSubscribed(true);
    }
  };

  return (
    <ConnectedLayout>
      <div className="mt-40">
        <div className="max-w-3xl m-auto">
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
            <img
              src={avatar}
              alt="avatar"
              className="w-[200px] h-[200px] rounded-full mb-10 shadow-lg shadow-black"
            />

            <ButtonSubscription disabled={loading} onClick={handleSubscription}>
              {subscribed ? "Se désabonner" : "s'abonner"}
            </ButtonSubscription>
          </motion.div>
          {isLoading && <div className="text-center">Chargement...</div>}

          {data?.length === 0 && (
            <div className="text-center mt-10">Aucun thread à afficher</div>
          )}

          {subscribed && (
            <div>
              <h1 className="text-3xl text-center font-bold my-10">
                Threads du compte
              </h1>
              {data?.map((thread) => (
                <div key={thread.id} className="flex flex-col gap-5">
                  <Messagecard
                    key={thread.image}
                    messageRef={ref}
                    threads={thread}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ConnectedLayout>
  );
}
