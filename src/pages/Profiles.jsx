import React, { useEffect, useState } from "react";
import ConnectedLayout from "../layouts/ConnectedLayout.jsx";
import { threadsDb, usersDb } from "../firebase";
import { getDocs, query, where, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Messagecard from "../components/Messagecard/Messagecard.jsx";
import ButtonSubscription from "../components/Button/ButtonSubscription.jsx";

export default function Profiles() {
  // States
  const [loading, setLoading] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Functions
  useEffect(() => {
    const fetchUsers = async () => {
      if (loading) return;

      try {
        const userSnapshot = await getDocs(usersDb);

        const profileUserData = userSnapshot.docs
          .find((doc) => {
            return doc.data().userId;
          })
          ?.data();

        const profileUserPseudo = profileUserData?.pseudo;
        const profileUserAvatar = profileUserData?.avatar;

        setPseudo(profileUserPseudo);
        setAvatar(profileUserAvatar);
      } catch (error) {
        console.error("Une erreur est survenue : ", error);
        setLoading(false);
      }
      setLoading(false);
    };

    fetchUsers().then();
  }, []);

  const handleSubscription = () => {
    if (subscribed) {
      setSubscribed(false);
    } else {
      setSubscribed(true);
    }
  };

  return (
    <ConnectedLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="shadow-2xl shadow-black rounded-3xl p-5 m-5"
      >
        <h1 className="text-3xl text-center font-bold my-10">
          Profil de {pseudo}
        </h1>
        <div className="flex flex-col items-center w-full h-full">
          <img
            src={avatar}
            alt="avatar"
            className="w-[200px] h-[200px] rounded-full mb-10 shadow-lg shadow-black"
          />
        </div>
        <ButtonSubscription disabled={loading} onClick={handleSubscription}>
          {subscribed ? "Se désabonner" : "s'abonner"}
        </ButtonSubscription>
      </motion.div>
    </ConnectedLayout>
  );
}
