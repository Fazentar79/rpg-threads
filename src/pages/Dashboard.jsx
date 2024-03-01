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
  const [loading, setLoading] = useState(true);
  const [pseudo, setPseudo] = useState("");
  const [creationDate, setCreationDate] = useState("");

  // Refs
  const ref = useRef(null);

  //Functions

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userSnapshot = await getDocs(usersDb);

        const currentUserPseudo = userSnapshot.docs.map((doc) => {
          if (doc.data().userId === user.uid) {
            return doc.data().pseudo;
          }
        });

        const currentUserCreationDate = userSnapshot.docs.map((doc) => {
          if (doc.data().userId === user.uid) {
            return doc.data().date;
          }
        });

        setPseudo(currentUserPseudo);
        setCreationDate(currentUserCreationDate);
        setLoading(false);
      } catch (error) {
        console.error("Une erreur est survenue : ", error);
        setLoading(false);
      }
    };

    fetchUsers().then();
  }, []);

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
              Création du compte :
              <span className="font-normal"> {creationDate}</span>
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
          <h2 className="my-10 text-center text-2xl font-bold">Mes Threads</h2>

          {isLoading && <div className="text-center">Chargement...</div>}

          {/*// show all threads for user connected*/}
          {data?.map((thread, index) => (
            <motion.div
              key={index}
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
        </div>
      </motion.div>
    </ConnectedLayout>
  );
}
