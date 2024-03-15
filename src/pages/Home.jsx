import { useEffect, useState, useRef } from "react";
import ButtonPost from "../components/Button/ButtonPost.jsx";
import { getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { threadsDb } from "../firebase";
import { Link } from "react-router-dom";
import Messagecard from "../components/Messagecard/Messagecard";
import ConnectedLayout from "../layouts/ConnectedLayout.jsx";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const ref = useRef(null);

  const fetchThreads = async (threads) => {
    try {
      const threadsQuery = query(threadsDb, orderBy("date", "desc"));
      const threadsSnapshot = await getDocs(threadsQuery);
      threads.current = threadsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setLoading(false);
    } catch (error) {
      console.error("Une erreur est survenue : ", error);
      setLoading(false);
    }

    return threads.current;
  };

  const handleThreadDeleted = () => {
    refetch().then();
  };

  const {
    data: threads,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["threads"],
    queryFn: fetchThreads,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error);
    }
  }, [error, isError]);

  return (
    <ConnectedLayout>
      <div className="mt-40">
        <div className="flex justify-end">
          <ButtonPost disabled={loading}>
            <Link to="/add-thread">
              <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9.65661 17L6.99975 17L6.99975 14M6.10235 14.8974L17.4107 3.58902C18.1918 2.80797 19.4581 2.80797 20.2392 3.58902C21.0202 4.37007 21.0202 5.6364 20.2392 6.41745L8.764 17.8926C8.22794 18.4287 7.95992 18.6967 7.6632 18.9271C7.39965 19.1318 7.11947 19.3142 6.8256 19.4723C6.49475 19.6503 6.14115 19.7868 5.43395 20.0599L3 20.9998L3.78312 18.6501C4.05039 17.8483 4.18403 17.4473 4.3699 17.0729C4.53497 16.7404 4.73054 16.424 4.95409 16.1276C5.20582 15.7939 5.50466 15.4951 6.10235 14.8974Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </ButtonPost>
        </div>

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
          {/*// show all threads*/}
          {threads?.map((threads) => (
            <motion.div
              key={threads.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: [0.9, 1.04, 0.9, 1] },
              }}
              transition={{
                type: "spring",
              }}
              className="m-auto w-full max-w-3xl"
            >
              <Messagecard
                key={threads.image}
                messageRef={ref}
                threads={threads}
                handleThreadDeleted={handleThreadDeleted}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ConnectedLayout>
  );
}
