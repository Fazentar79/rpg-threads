import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import MakeForm from "../components/MakeForm/MakeForm.jsx";
import Messagecard from "../components/Messagecard/Messagecard.jsx";
import ButtonPost from "../components/Button/ButtonPost.jsx";

export default function Home() {
  //States
  const [loading, setLoading] = useState(false);
  const [createNewThread, setCreateNewThread] = useState(false);

  // Refs
  const pseudo = useRef("");
  const image = useRef("");
  const message = useRef("");

  // Fetch threads
  const fetchThreads = async () => {
    // Fetch threads from firebase
    const response = await fetch(
      `https://rpg-threads-default-rtdb.europe-west1.firebasedatabase.app/threads.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Une erreur est survenue");
    }

    const data = await response.json();

    // Get the threads
    const promises = data.map(async (threads) => {
      const response = await fetch(
        `https://rpg-threads-default-rtdb.europe-west1.firebasedatabase.app/threads/${threads.pseudo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return await response.json();
    });

    const threadsDetails = await Promise.all(promises);
    return [...threadsDetails];
  };

  // Functions
  const {
    data: threads,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["threads"],
    queryFn: fetchThreads,
    staleTime: 10000,
    gcTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error);
    }
  }, [error, isError]);

  const onCreateNewThread = async (e) => {
    const newThread = {
      pseudo: pseudo.current.value,
      message: message.current.value,
      image: {
        other: {
          home: {
            front_default: image.current.value,
          },
        },
      },
    };

    //Add to firebase realtime
    const response = await fetch(
      "https://rpg-threads-default-rtdb.europe-west1.firebasedatabase.app/threads.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newThread),
      },
    );

    // Error
    if (!response.ok) {
      toast.error("Une erreur est intervenue");
      return;
    }

    // Get the id
    const { message: newthreadMessage } = await response.json();
  };

  // Modale
  useEffect(() => {
    if (onCreateNewThread) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [onCreateNewThread]);

  return (
    <div className="h-[100wh]">
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
        {threads?.map((threads, index) => (
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
            <Messagecard threads={threads} />
          </motion.div>
        ))}
      </motion.div>

      {isLoading && <div className="text-center">Chargement...</div>}

      <div className="flex justify-end align-bottom">
        <ButtonPost disabled={loading} onClick={() => setCreateNewThread(true)}>
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
            <path
              d="M9.65661 17L6.99975 17L6.99975 14M6.10235 14.8974L17.4107 3.58902C18.1918 2.80797 19.4581 2.80797 20.2392 3.58902C21.0202 4.37007 21.0202 5.6364 20.2392 6.41745L8.764 17.8926C8.22794 18.4287 7.95992 18.6967 7.6632 18.9271C7.39965 19.1318 7.11947 19.3142 6.8256 19.4723C6.49475 19.6503 6.14115 19.7868 5.43395 20.0599L3 20.9998L3.78312 18.6501C4.05039 17.8483 4.18403 17.4473 4.3699 17.0729C4.53497 16.7404 4.73054 16.424 4.95409 16.1276C5.20582 15.7939 5.50466 15.4951 6.10235 14.8974Z"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </ButtonPost>
      </div>

      {createPortal(
        <AnimatePresence>
          {createNewThread && (
            <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black bg-opacity-90 z-50 flex justify-center">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                animate="visible"
                initial="hidden"
                exit="hidden"
                className="p-8 bg-white rounded-xl max-w-xl w-full my-10 overflow-y-auto"
              >
                <div className="flex justify-end text-black hover:text-gray-100 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreateNewThread(false);
                    }}
                  >
                    <g fill="currentColor">
                      <path d="M10.03 8.97a.75.75 0 0 0-1.06 1.06L10.94 12l-1.97 1.97a.75.75 0 1 0 1.06 1.06L12 13.06l1.97 1.97a.75.75 0 0 0 1.06-1.06L13.06 12l1.97-1.97a.75.75 0 1 0-1.06-1.06L12 10.94l-1.97-1.97Z"></path>
                      <path
                        fillRule="evenodd"
                        d="M12.057 1.25h-.114c-2.309 0-4.118 0-5.53.19c-1.444.194-2.584.6-3.479 1.494c-.895.895-1.3 2.035-1.494 3.48c-.19 1.411-.19 3.22-.19 5.529v.114c0 2.309 0 4.118.19 5.53c.194 1.444.6 2.584 1.494 3.479c.895.895 2.035 1.3 3.48 1.494c1.411.19 3.22.19 5.529.19h.114c2.309 0 4.118 0 5.53-.19c1.444-.194 2.584-.6 3.479-1.494c.895-.895 1.3-2.035 1.494-3.48c.19-1.411.19-3.22.19-5.529v-.114c0-2.309 0-4.118-.19-5.53c-.194-1.444-.6-2.584-1.494-3.479c-.895-.895-2.035-1.3-3.48-1.494c-1.411-.19-3.22-.19-5.529-.19ZM3.995 3.995c.57-.57 1.34-.897 2.619-1.069c1.3-.174 3.008-.176 5.386-.176s4.086.002 5.386.176c1.279.172 2.05.5 2.62 1.069c.569.57.896 1.34 1.068 2.619c.174 1.3.176 3.008.176 5.386s-.002 4.086-.176 5.386c-.172 1.279-.5 2.05-1.069 2.62c-.57.569-1.34.896-2.619 1.068c-1.3.174-3.008.176-5.386.176s-4.086-.002-5.386-.176c-1.279-.172-2.05-.5-2.62-1.069c-.569-.57-.896-1.34-1.068-2.619c-.174-1.3-.176-3.008-.176-5.386s.002-4.086.176-5.386c.172-1.279.5-2.05 1.069-2.62Z"
                        clipRule="evenodd"
                      ></path>
                    </g>
                  </svg>
                </div>

                <h1 className="text-3xl font-semibold mb-5">Créer un thread</h1>

                <MakeForm
                  pseudo={pseudo}
                  message={message}
                  image={image}
                  onFormSubmittedHandler={onCreateNewThread}
                  threads={threads}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
