import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { getDocs, deleteDoc, doc } from "firebase/firestore";
import { threadsDb, usersDb } from "../../firebase.js";
import { Link, useParams } from "react-router-dom";

export default function Messagecard({ ref, threads, ...props }) {
  //Variables
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  //States
  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [pseudo, setPseudo] = useState([]);
  const [userConnected, setUserConnected] = useState(false);

  useEffect(() => {
    const fetchUserPseudo = async () => {
      try {
        const userSnapshot = await getDocs(usersDb);

        const currentUserPseudo = userSnapshot.docs.map((doc) => {
          if (doc.data().userId === user.userId) {
            return doc.data().pseudo;
          }
        });
        setLoading(false);
        setPseudo(currentUserPseudo);
      } catch (error) {
        console.error("Une erreur est survenue : ", error);
        setLoading(false);
      }
    };

    fetchUserPseudo().then();
  }, []);

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
      console.log("threadDocRef: ", threadDocRef);
      await deleteDoc(threadDocRef);

      window.location.reload();
      setLoading(true);
    } catch (error) {
      console.error("Erreur: ", error);
    }
    setLoading(false);
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col p-5 my-10 rounded-3xl shadow-2xl shadow-black bg-white`}
    >
      <div className="flex flex-col gap-1">
        <span className="flex justify-between text-lg font-bold py-5">
          {threads.pseudo}
          {userConnected && (
            <>
              <div className="flex">
                <Link to={`/updated-thread/${threads.id}`} className="me-5">
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="cursor-pointer"
                  >
                    <path
                      d="M9.65661 17L6.99975 17L6.99975 14M6.10235 14.8974L17.4107 3.58902C18.1918 2.80797 19.4581 2.80797 20.2392 3.58902C21.0202 4.37007 21.0202 5.6364 20.2392 6.41745L8.764 17.8926C8.22794 18.4287 7.95992 18.6967 7.6632 18.9271C7.39965 19.1318 7.11947 19.3142 6.8256 19.4723C6.49475 19.6503 6.14115 19.7868 5.43395 20.0599L3 20.9998L3.78312 18.6501C4.05039 17.8483 4.18403 17.4473 4.3699 17.0729C4.53497 16.7404 4.73054 16.424 4.95409 16.1276C5.20582 15.7939 5.50466 15.4951 6.10235 14.8974Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Link>
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="cursor-pointer"
                  onClick={handleDeleteThread}
                >
                  <path
                    d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </>
          )}
        </span>
        <span className="text-sm py-5">{threads.message}</span>
      </div>
      {showImage && (
        <div className="flex justify-center my-10">
          <a href={threads.image} target="_blank">
            <img
              src={threads.image}
              alt="Image"
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

        <div className="flex">
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-5 cursor-pointer"
          >
            <path
              d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {/*{userConnected && (*/}
          {/*)}*/}
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            className="cursor-pointer"
          >
            <path
              d="M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
