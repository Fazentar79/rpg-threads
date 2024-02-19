import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button/Button.jsx";
import { useContext, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../store/AuthProvider";
import { usePureFetch } from "../utils/usePureFetch.js";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import MakeForm from "../components/MakeForm/MakeForm.jsx";
import { queryClient } from "../utils/query.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import Messagecard from "../components/Messagecard/Messagecard.jsx";

export default function Home() {
  // Variables
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: threads,
    isLoading: threadsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["threads", id],
    queryFn: () =>
      usePureFetch(
        isNaN(
          id,
        )`https://rpg-threads-default-rtdb.europe-west1.firebasedatabase.app/threads.json`,
        (data) => {
          isNaN(id) ? (data.id = id) : data.id;
        },
      ),
  });

  const {
    mutate,
    isError: isErrorMutation,
    error: errorMutation,
  } = useMutation({
    mutationFn: async (updatedThread) => {
      const response = await fetch(
        `https://rpg-threads-default-rtdb.europe-west1.firebasedatabase.app/threads/${id}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedThread),
        },
      );

      if (!response.ok) {
        toast.error("Une erreur est survenue");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["threads", id],
        exact: true,
      });
      setUpdateThreads(false);
    },
    onMutate: (updatedThread) => {
      const previousUpdate = queryClient.getQueryData(["threads", { id }]);

      queryClient.setQueryData(["threads", { id }], updatedThread);

      return { previousUpdate };
    },
    onError: (context) => {
      queryClient.setQueryData(["threads", { id }], [context.previousUpdate]);
    },
  });

  // Refs
  const pseudo = useRef();
  const message = useRef();
  const image = useRef();

  // States
  const [updateThreads, setUpdateThreads] = useState(false);
  const [loading, setLoading] = useState(false);

  //modale
  useEffect(() => {
    if (threads) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [updateThreads]);

  useEffect(() => {
    if (isError) {
      toast.error(error);
    }
  }, [error, isError]);

  useEffect(() => {
    if (isErrorMutation) {
      toast.error(errorMutation);
    }
  }, [errorMutation, isErrorMutation]);

  // Functions
  const beforeMutate = () => {
    const updatedThreads = {
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
    mutate(updatedThreads);
  };

  if (loading || threadsLoading)
    return <div className="text-center">Loading...</div>;

  if (!threads || !threads.pseudo || !threads.message)
    return <div className="text-center">Thread non trouvé</div>;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      initial={"hidden"}
      animate={"visible"}
      className="max-w-3xl mx-auto"
    >
      <Messagecard threads={threads} details />>
      {isNaN(id) && (
        <div className="z-10">
          <Button disabled={loading}>Poster</Button>
        </div>
      )}
    </motion.div>
  );
}
