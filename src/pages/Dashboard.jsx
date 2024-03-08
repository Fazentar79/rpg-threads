import Button from "../components/Button/Button.jsx";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../store/AuthProvider";
import ConnectedLayout from "../layouts/ConnectedLayout.jsx";
import { threadsDb, usersDb } from "../firebase";
import { getDocs, query, where, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Messagecard from "../components/Messagecard/Messagecard.jsx";

export default function Dashboard() {
  // Variables
  const { user } = useContext(AuthContext);
  const { logOut } = useContext(AuthContext);
  const { deleteUserAccount } = useContext(AuthContext);

  // States
  const [loading, setLoading] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);

  // Refs
  const ref = useRef(null);

  //Functions

  useEffect(() => {
    const fetchUsers = async () => {
      if (loading) return;

      try {
        const userSnapshot = await getDocs(usersDb);

        const currentUserData = userSnapshot.docs
          .find((doc) => {
            return doc.data().userId === user.uid;
          })
          ?.data();

        const currentUserPseudo = currentUserData?.pseudo;
        const currentUserCreationDate = currentUserData?.date;
        const currentUserAvatar = currentUserData?.avatar;

        setPseudo(currentUserPseudo);
        setCreationDate(currentUserCreationDate);
        setAvatar(currentUserAvatar);
      } catch (error) {
        console.error("Une erreur est survenue : ", error);
        setLoading(false);
      }
      setLoading(false);
    };

    fetchUsers().then();
  }, []);

  useEffect(() => {
    if (avatar) {
      setShowAvatar(true);
    }
  }, [avatar]);

  // Get all threads for user connected

  const fetchAllThreadsUser = async () => {
    try {
      const threadsQuery = query(
        threadsDb,
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
      );
      const threadsSnapshot = await getDocs(threadsQuery);
      const threadsUser = threadsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setLoading(false);
      return threadsUser;
    } catch (error) {
      console.error("Une erreur est survenue : ", error);
      setLoading(false);
      return [];
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["threads"],
    queryFn: fetchAllThreadsUser,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error);
    }
  }, [error, isError]);

  return (
    <ConnectedLayout>
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
        <h1 className="my-10 text-center text-3xl font-bold">Profil</h1>

        <div className="flex flex-col justify-center items-center">
          {showAvatar ? (
            <>
              <img
                src={avatar}
                alt="avatar"
                className="rounded-full w-[300px] h-[300px] shadow-lg shadow-black mb-5"
              />
              <Link to="/updated-avatar" className="hover:text-blue-600">
                Modifier l'avatar
              </Link>
            </>
          ) : (
            <>
              <svg
                width="150px"
                height="150px"
                viewBox="0 0 24 24"
                fill="none"
                className="rounded-full shadow-lg shadow-black p-5 mb-5"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5ZM7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM7.45609 16.7264C6.40184 17.1946 6 17.7858 6 18.5C6 18.7236 6.03976 18.8502 6.09728 18.942C6.15483 19.0338 6.29214 19.1893 6.66219 19.3567C7.45312 19.7145 9.01609 20 12 20C14.9839 20 16.5469 19.7145 17.3378 19.3567C17.7079 19.1893 17.8452 19.0338 17.9027 18.942C17.9602 18.8502 18 18.7236 18 18.5C18 17.7858 17.5982 17.1946 16.5439 16.7264C15.4614 16.2458 13.8722 16 12 16C10.1278 16 8.53857 16.2458 7.45609 16.7264ZM6.64442 14.8986C8.09544 14.2542 10.0062 14 12 14C13.9938 14 15.9046 14.2542 17.3556 14.8986C18.8348 15.5554 20 16.7142 20 18.5C20 18.9667 19.9148 19.4978 19.5973 20.0043C19.2798 20.5106 18.7921 20.8939 18.1622 21.1789C16.9531 21.7259 15.0161 22 12 22C8.98391 22 7.04688 21.7259 5.83781 21.1789C5.20786 20.8939 4.72017 20.5106 4.40272 20.0043C4.08524 19.4978 4 18.9667 4 18.5C4 16.7142 5.16516 15.5554 6.64442 14.8986Z"
                  fill="#0F1729"
                />
              </svg>
              <Link to="/updated-avatar" className="hover:text-blue-600">
                Ajouter un avatar
              </Link>
            </>
          )}
        </div>
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: [0.9, 1.04, 0.9, 1] },
          }}
          transition={{
            type: "spring",
          }}
          className="shadow-2xl shadow-black rounded-3xl p-5 m-5"
        >
          <div className="text-center">
            <p className="font-bold">
              Email : <span className="font-normal">{user.email}</span>
            </p>
            <p className="font-bold">
              Pseudo : <span className="font-normal"> {pseudo} </span>
            </p>
            <p className="font-bold">
              Création du compte :{" "}
              <span className="font-normal">
                {new Date(creationDate?.seconds * 1000).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  },
                )}
              </span>
            </p>
          </div>
          <div className="mt-10 text-center">
            <p className=" hover:text-blue-600 duration-150">
              <Link to="/updated-pseudo">Modifier le Pseudo</Link>
            </p>
            <p className="my-3 hover:text-blue-600 duration-150">
              <Link to="/forgot-password">Modifier le mot de passe</Link>
            </p>
            <Link
              to="/delete-account"
              className="text-red-600 hover:font-bold duration-150 cursor-pointer"
            >
              Supprimer le compte
            </Link>
          </div>
          <div className="mt-10">
            <Button onClick={() => logOut()}> Déconnexion </Button>
          </div>
        </motion.div>
        <div>
          <h2 className="mt-10 text-center text-2xl font-bold">Mes Threads</h2>

          {isLoading && <div className="text-center">Chargement...</div>}
          {data?.length === 0 && (
            <div className="text-center mt-10">Aucun thread à afficher</div>
          )}

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
            {/*// show all threads for user connected*/}
            {data?.map((thread) => (
              <motion.div
                key={thread.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: [0.9, 1.04, 0.9, 1] },
                }}
                transition={{
                  type: "spring",
                }}
                className="m-auto w-full max-w-3xl"
              >
                <Messagecard key={thread.image} ref={ref} threads={thread} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </ConnectedLayout>
  );
}
