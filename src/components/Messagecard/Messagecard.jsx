import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../store/AuthProvider";
import {
  query,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  where,
  orderBy,
} from "firebase/firestore";
import { threadsDb, usersDb, commentsDb } from "../../firebase.js";
import { Link } from "react-router-dom";
import ConnectedLayout from "../../layouts/ConnectedLayout.jsx";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function Messagecard({ ref, threads, ...props }) {
  //Variables
  const { user } = useContext(AuthContext);

  //States
  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [userConnected, setUserConnected] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [addComment, setAddComment] = useState(false);
  const [showUpdateComment, setShowUpdateComment] = useState(false);

  //Refs
  const comment = useRef("");
  const updatedComment = useRef("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (loading) return;

      try {
        const userSnapshot = await getDocs(usersDb);

        userSnapshot.docs
          .find((doc) => {
            return doc.data().userId === user.uid;
          })
          ?.data();

        setLoading(false);
      } catch (error) {
        console.error("Une erreur est survenue : ", error);
        setLoading(false);
      }
    };

    fetchUserData().then();
  }, []);

  useEffect(() => {
    const fetchUserThreadData = async () => {
      if (loading) return;

      try {
        const userSnapshot = await getDocs(usersDb);

        const messageAuthorData = userSnapshot.docs
          .find((doc) => {
            return doc.data().userId === threads.userId;
          })
          ?.data();

        const messageAuthorAvatar = messageAuthorData?.avatar;

        setAvatar(messageAuthorAvatar);
        setLoading(false);
      } catch (error) {
        console.error("Une erreur est survenue : ", error);
        setLoading(false);
      }
    };

    fetchUserThreadData().then();
  }, [threads.userId]);

  const fetchAllCommentsThread = async () => {
    try {
      const commentsQuery = query(
        commentsDb,
        where("threadId", "==", threads.id),
        orderBy("date", "desc"),
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const comments = commentsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setLoading(false);
      console.log(comments);
      return comments;
    } catch (error) {
      console.error("Une erreur est survenue : ", error);
      setLoading(false);
    }
  };

  const onCreateNewComment = async () => {
    if (loading) return;

    try {
      const userSnapshot = await getDocs(usersDb);
      const userData = userSnapshot.docs
        .find((doc) => {
          return doc.data().userId === user.uid;
        })
        ?.data();

      await addDoc(commentsDb, {
        message: comment.current.value,
        userId: user.uid,
        threadId: threads.id,
        date: serverTimestamp(),
        pseudo: userData?.pseudo,
        avatar: userData?.avatar,
      });

      setLoading(false);
      setAddComment(false);
      refetch().then((r) => r);
    } catch (error) {
      console.error("Erreur: ", error);
    }
    setLoading(false);
  };

  const onUpdateComment = async (id) => {
    try {
      setLoading(false);

      const commentDocRef = doc(commentsDb, id);
      await updateDoc(commentDocRef, {
        message: updatedComment.current.value,
        date: serverTimestamp(),
      });

      setLoading(true);
      setShowUpdateComment(false);
      refetch().then((r) => r);
    } catch (error) {
      console.error("Erreur: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (avatar) {
      setShowAvatar(true);
    }
  }, [avatar]);

  useEffect(() => {
    const regex = /(http(s?):)([/.\w\s-])*\.(?:jpg|gif|png)/;
    if (threads.image && regex.test(threads.image)) {
      setShowImage(true);
    }
  }, [threads.image]);

  useEffect(() => {
    if (threads.userId === user.uid) {
      setUserConnected(true);
    }
  }, []);

  const handleDeleteThread = async () => {
    try {
      setLoading(false);

      const threadDocRef = doc(threadsDb, threads.id);
      await deleteDoc(threadDocRef);

      window.location.reload();
      setLoading(true);
    } catch (error) {
      console.error("Erreur: ", error);
    }
    setLoading(false);
  };

  const handleDeleteComment = async (id) => {
    try {
      setLoading(false);

      const commentDocRef = doc(commentsDb, id);
      await deleteDoc(commentDocRef);

      refetch().then((r) => r);
      setLoading(true);
    } catch (error) {
      console.error("Erreur: ", error);
    }
    setLoading(false);
  };

  const {
    data: comments,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [threads.id],
    queryFn: fetchAllCommentsThread,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error);
    }
  }, [error, isError]);

  return (
    <ConnectedLayout>
      <div
        ref={ref}
        className={`flex flex-col p-5 my-10 rounded-3xl shadow-2xl shadow-black bg-white`}
      >
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-lg font-bold py-5">
            <div className="flex">
              {showAvatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="rounded-full w-[30px] h-[30px] shadow-lg shadow-black me-2"
                />
              ) : (
                <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="rounded-full shadow-lg shadow-black p-2 me-2"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5ZM7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM7.45609 16.7264C6.40184 17.1946 6 17.7858 6 18.5C6 18.7236 6.03976 18.8502 6.09728 18.942C6.15483 19.0338 6.29214 19.1893 6.66219 19.3567C7.45312 19.7145 9.01609 20 12 20C14.9839 20 16.5469 19.7145 17.3378 19.3567C17.7079 19.1893 17.8452 19.0338 17.9027 18.942C17.9602 18.8502 18 18.7236 18 18.5C18 17.7858 17.5982 17.1946 16.5439 16.7264C15.4614 16.2458 13.8722 16 12 16C10.1278 16 8.53857 16.2458 7.45609 16.7264ZM6.64442 14.8986C8.09544 14.2542 10.0062 14 12 14C13.9938 14 15.9046 14.2542 17.3556 14.8986C18.8348 15.5554 20 16.7142 20 18.5C20 18.9667 19.9148 19.4978 19.5973 20.0043C19.2798 20.5106 18.7921 20.8939 18.1622 21.1789C16.9531 21.7259 15.0161 22 12 22C8.98391 22 7.04688 21.7259 5.83781 21.1789C5.20786 20.8939 4.72017 20.5106 4.40272 20.0043C4.08524 19.4978 4 18.9667 4 18.5C4 16.7142 5.16516 15.5554 6.64442 14.8986Z"
                    fill="#0F1729"
                  />
                </svg>
              )}
              {!userConnected ? (
                <Link
                  to={`/profiles/${threads.userId}`}
                  className="hover:underline"
                >
                  {threads.pseudo}
                </Link>
              ) : (
                <Link to={`/Dashboard`} className="hover:underline">
                  {threads.pseudo}
                </Link>
              )}
            </div>
            {userConnected && (
              <div className="flex">
                <Link to={`/updated-thread/${threads.id}`}>
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="cursor-pointer me-5 hover:scale-125 transition duration-300 ease-in-out"
                  >
                    <path
                      d="M9.65661 17L6.99975 17L6.99975 14M6.10235 14.8974L17.4107 3.58902C18.1918 2.80797 19.4581 2.80797 20.2392 3.58902C21.0202 4.37007 21.0202 5.6364 20.2392 6.41745L8.764 17.8926C8.22794 18.4287 7.95992 18.6967 7.6632 18.9271C7.39965 19.1318 7.11947 19.3142 6.8256 19.4723C6.49475 19.6503 6.14115 19.7868 5.43395 20.0599L3 20.9998L3.78312 18.6501C4.05039 17.8483 4.18403 17.4473 4.3699 17.0729C4.53497 16.7404 4.73054 16.424 4.95409 16.1276C5.20582 15.7939 5.50466 15.4951 6.10235 14.8974Z"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="cursor-pointer hover:scale-125 transition duration-300 ease-in-out"
                  onClick={handleDeleteThread}
                >
                  <path
                    d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
          <span className="text-sm py-5">{threads.message}</span>
        </div>
        {showImage && (
          <div className="flex justify-center my-10">
            <a href={threads.image} target="_blank">
              <img
                src={threads.image}
                alt="Lien casser"
                className="w-max-[250px] h-[250px]"
              />
            </a>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-sm">
            {new Date(threads.date.seconds * 1000).toLocaleString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>

          <button
            onClick={(event) => {
              event.stopPropagation();
              setShowComments(!showComments);
            }}
          >
            {showComments ? (
              "Cacher les commentaires"
            ) : (
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
                className="me-10 cursor-pointer hover:scale-125 transition duration-300 ease-in-out"
              >
                <path
                  d="M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
        {showComments && (
          <div className="text-center mt-5 p-5 border-t">
            <div>
              <span>Commentaires :</span>
            </div>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setAddComment(!addComment);
              }}
            >
              {addComment ? (
                "Cacher l'ajout de commentaire"
              ) : (
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="cursor-pointer hover:scale-125 transition duration-300 ease-in-out"
                >
                  <path
                    d="M9.65661 17L6.99975 17L6.99975 14M6.10235 14.8974L17.4107 3.58902C18.1918 2.80797 19.4581 2.80797 20.2392 3.58902C21.0202 4.37007 21.0202 5.6364 20.2392 6.41745L8.764 17.8926C8.22794 18.4287 7.95992 18.6967 7.6632 18.9271C7.39965 19.1318 7.11947 19.3142 6.8256 19.4723C6.49475 19.6503 6.14115 19.7868 5.43395 20.0599L3 20.9998L3.78312 18.6501C4.05039 17.8483 4.18403 17.4473 4.3699 17.0729C4.53497 16.7404 4.73054 16.424 4.95409 16.1276C5.20582 15.7939 5.50466 15.4951 6.10235 14.8974Z"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            {addComment && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  onCreateNewComment().then();
                }}
                className="flex flex-col justify-center items-center mt-5"
              >
                <textarea
                  name="comment"
                  className="border rounded-lg p-2 me-2 w-7/12"
                  rows="3"
                  cols="50"
                  id="comment"
                  placeholder="Ajouter un commentaire"
                  ref={comment}
                />

                <button
                  className="w-max bg-gray-400 text-white my-2 p-2 rounded-lg hover:opacity-70 duration-150"
                  type="submit"
                >
                  Ajouter
                </button>
              </form>
            )}
            {isLoading && <div className="text-center">Chargement...</div>}

            {comments?.length === 0 && (
              <div className="text-center mt-10">
                Aucun commentaire à afficher
              </div>
            )}

            {comments?.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-5">
                <div className="flex justify-between">
                  <div className="flex">
                    {comment.avatar ? (
                      <img
                        src={comment.avatar}
                        alt="avatar"
                        className="rounded-full w-[30px] h-[30px] shadow-lg shadow-black me-2"
                      />
                    ) : (
                      <svg
                        width="30px"
                        height="30px"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="rounded-full shadow-lg shadow-black p-2 me-2"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5ZM7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM7.45609 16.7264C6.40184 17.1946 6 17.7858 6 18.5C6 18.7236 6.03976 18.8502 6.09728 18.942C6.15483 19.0338 6.29214 19.1893 6.66219 19.3567C7.45312 19.7145 9.01609 20 12 20C14.9839 20 16.5469 19.7145 17.3378 19.3567C17.7079 19.1893 17.8452 19.0338 17.9027 18.942C17.9602 18.8502 18 18.7236 18 18.5C18 17.7858 17.5982 17.1946 16.5439 16.7264C15.4614 16.2458 13.8722 16
                                    12 16C10.1278 16 8.53857 16.2458 7.45609 16.7264ZM6.64442 14.8986C8.09544 14.2542 10.0062 14 12 14C13.9938 14 15.9046 14.2542 17.3556 14.8986C18.8348 15.5554 20 16.7142 20 18.5C20 18.9667 19.9148 19.4978 19.5973 20.0043C19.2798 20.5106 18.7921 20.8939 18.1622 21.1789C16.9531 21.7259 15.0161 22 12 22C8.98391 22 7.04688 21.7259 5.83781 21.1789C5.20786 20.8939 4.72017 20.5106 4.40272 20.0043C4.08524 19.4978 4 18.9667 4 18.5C4 16.7142 5.16516 15.5554 6.64442 14.8986Z"
                          fill="#0F1729"
                        />
                      </svg>
                    )}
                    {!userConnected ? (
                      <Link
                        to={`/profiles/${comment.userId}`}
                        className="font-bold hover:underline"
                      >
                        {comment.pseudo}
                      </Link>
                    ) : (
                      <Link
                        to={`/Dashboard`}
                        className="font-bold hover:underline"
                      >
                        {comment.pseudo}
                      </Link>
                    )}
                  </div>
                  {comment.userId === user.uid && (
                    <div className="flex items-start">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setShowUpdateComment(!showUpdateComment);
                        }}
                      >
                        {showUpdateComment ? (
                          "Cacher"
                        ) : (
                          <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="cursor-pointer me-5 hover:scale-125 transition duration-300 ease-in-out"
                          >
                            <path
                              d="M9.65661 17L6.99975 17L6.99975 14M6.10235 14.8974L17.4107 3.58902C18.1918 2.80797 19.4581 2.80797 20.2392 3.58902C21.0202 4.37007 21.0202 5.6364 20.2392 6.41745L8.764 17.8926C8.22794 18.4287 7.95992 18.6967 7.6632 18.9271C7.39965 19.1318 7.11947 19.3142 6.8256 19.4723C6.49475 19.6503 6.14115 19.7868 5.43395 20.0599L3 20.9998L3.78312 18.6501C4.05039 17.8483 4.18403 17.4473 4.3699 17.0729C4.53497 16.7404 4.73054 16.424 4.95409 16.1276C5.20582 15.7939 5.50466 15.4951 6.10235 14.8974Z"
                              stroke="#000000"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                      <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="cursor-pointer hover:scale-125 transition duration-300 ease-in-out"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <path
                          d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {showUpdateComment && comment.userId === user.uid && (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      onUpdateComment(comment.id).then();
                    }}
                    className="flex flex-col justify-center items-center mt-5"
                  >
                    <textarea
                      name="comment"
                      className="border rounded-lg p-2 me-2 w-7/12"
                      rows="3"
                      cols="50"
                      id="comment"
                      placeholder="Modifier le commentaire"
                      ref={updatedComment}
                    />

                    <button
                      className="w-max bg-gray-400 text-white my-2 p-2 rounded-lg hover:opacity-70 duration-150"
                      type="submit"
                    >
                      Modifier
                    </button>
                  </form>
                )}

                <span className="text-start">{comment.message}</span>
                <span className="text-start border-b mb-5">
                  {new Date(comment.date.seconds * 1000).toLocaleString(
                    "fr-FR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConnectedLayout>
  );
}

Messagecard.propTypes = {
  ref: PropTypes.object,
  threads: PropTypes.object,
};
