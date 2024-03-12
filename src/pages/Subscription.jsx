import React, { useEffect, useState, useContext } from "react";
import ConnectedLayout from "../layouts/ConnectedLayout.jsx";
import { usersDb } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { AuthContext } from "../store/AuthProvider";
import ButtonCancel from "../components/Button/ButtonCancel.jsx";
import { Link } from "react-router-dom";

export default function Subscription() {
  const { user } = useContext(AuthContext);

  // States
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      const userDocRef = doc(usersDb, user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userSubscriptions = userDocSnapshot.data().subscriptions || [];

      const subscriptionData = await Promise.all(
        userSubscriptions.map(async (subscriptionId) => {
          const subscriptionDocRef = doc(usersDb, subscriptionId);
          const subscriptionDocSnapshot = await getDoc(subscriptionDocRef);
          const subscriptionData = subscriptionDocSnapshot.data();
          return {
            id: subscriptionId,
            pseudo: subscriptionData.pseudo,
            avatar: subscriptionData.avatar,
          };
        }),
      );

      setSubscriptions(subscriptionData);
      setLoading(false);
    };

    fetchSubscriptions().then();
  }, [user]);

  return (
    <ConnectedLayout>
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
          <h1 className="text-3xl text-center font-bold my-10">Abonnements</h1>
        </Link>

        {loading && (
          <div className="text-center">
            <p>Chargement...</p>
          </div>
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
        >
          {subscriptions.length === 0 && (
            <div className="text-center">
              <p>Vous n'avez pas d'abonnement.</p>
            </div>
          )}
          {subscriptions.map((subscription) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: [0.9, 1.04, 0.9, 1] },
              }}
              transition={{
                type: "spring",
              }}
              key={subscription.id}
              className="w-7/12 m-auto mt-5 shadow-lg shadow-black rounded-3xl p-5"
            >
              <div className="flex justify-evenly items-center text-center">
                <img
                  src={subscription.avatar}
                  alt="avatar"
                  className="w-[50px] h-[50px] rounded-full shadow-lg shadow-black"
                />
                <div>
                  <h2>
                    <span className="font-bold">Pseudo</span> :{" "}
                    {subscription.pseudo}
                  </h2>
                  <Link
                    to={`/profiles/${subscription.id}`}
                    className="hover:underline hover:text-blue-600"
                  >
                    Voir le profil
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ConnectedLayout>
  );
}
