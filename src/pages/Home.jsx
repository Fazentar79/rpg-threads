import { useEffect, useState, useContext, useRef } from "react";
import ButtonPost from "../components/Button/ButtonPost.jsx";
import { getDocs, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { threadsDb, usersDb } from "../firebase";
import { AuthContext } from "../store/AuthProvider";
import { Link } from "react-router-dom";

export default function Home() {
  //Variables
  const { user } = useContext(AuthContext);

  //States
  const [loading, setLoading] = useState(false);
  const [pseudo, setPseudo] = useState([]);

  // // Functions

  // //Get pseudo
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userSnapshot = await getDocs(usersDb);
        const currentUserPseudo = userSnapshot.docs.map((doc) => {
          if (doc.data().userId === user.uid) {
            pseudo.push(doc.data().pseudo);
            return doc.data().pseudo;
          }
        });
        setPseudo(currentUserPseudo);
        setLoading(false);
      } catch (error) {
        console.error("Une erreur est survenue : ", error);
        setLoading(false);
      }
    };
    fetchUsers().then((r) => r);
  }, []);

  // Get all threads

  const fetchThreads = async () => {
    try {
      const threadsSnapshot = await getDocs(threadsDb);
      threads.current = threadsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setLoading(false);
      console.log(threads.current);
    } catch (error) {
      console.error("Une erreur est survenue : ", error);
      setLoading(false);
    }
  };

  const {
    data: threads,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: "threads",
    queryFn: fetchThreads,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error);
    }
  }, [error, isError]);

  return (
    <div>
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
        {/*// show all threads*/}
        {threads?.map((thread, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: [0.9, 1.04, 0.9, 1] },
            }}
            transition={{
              type: "spring",
            }}
          >
            <div className="flex justify-between">
              <div>
                <p>{thread.message}</p>
                <p>{thread.date}</p>
              </div>
              <div>
                <p>{pseudo}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {isLoading && <div className="text-center">Chargement...</div>}

      <div className="flex justify-end align-bottom">
        <ButtonPost disabled={loading}>
          <Link to="/add-thread">
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
              <path
                d="M9.65661 17L6.99975 17L6.99975 14M6.10235 14.8974L17.4107 3.58902C18.1918 2.80797 19.4581 2.80797 20.2392 3.58902C21.0202 4.37007 21.0202 5.6364 20.2392 6.41745L8.764 17.8926C8.22794 18.4287 7.95992 18.6967 7.6632 18.9271C7.39965 19.1318 7.11947 19.3142 6.8256 19.4723C6.49475 19.6503 6.14115 19.7868 5.43395 20.0599L3 20.9998L3.78312 18.6501C4.05039 17.8483 4.18403 17.4473 4.3699 17.0729C4.53497 16.7404 4.73054 16.424 4.95409 16.1276C5.20582 15.7939 5.50466 15.4951 6.10235 14.8974Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Link>
        </ButtonPost>
      </div>
    </div>
  );
}
