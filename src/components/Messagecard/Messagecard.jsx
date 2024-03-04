import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { getDocs } from "firebase/firestore";
import { usersDb } from "../../firebase.js";
import { Link } from "react-router-dom";

export default function Messagecard({ ref, threads, ...props }) {
  //Variables
  const { user } = useContext(AuthContext);

  //States
  const [loading, setLoading] = useState(true);
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

  return (
    <div
      ref={ref}
      className={`flex flex-col p-5 mx-5 my-10 rounded-3xl shadow-2xl shadow-black `}
    >
      <div className="flex flex-col gap-1">
        <span className="flex justify-between text-lg font-bold py-5">
          {threads.pseudo}
          {userConnected && (
            <Link to={`updated-thread/${threads.id}`}>
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9.65661 17L6.99975 17L6.99975 14M6.10235 14.8974L17.4107 3.58902C18.1918 2.80797 19.4581 2.80797 20.2392 3.58902C21.0202 4.37007 21.0202 5.6364 20.2392 6.41745L8.764 17.8926C8.22794 18.4287 7.95992 18.6967 7.6632 18.9271C7.39965 19.1318 7.11947 19.3142 6.8256 19.4723C6.49475 19.6503 6.14115 19.7868 5.43395 20.0599L3 20.9998L3.78312 18.6501C4.05039 17.8483 4.18403 17.4473 4.3699 17.0729C4.53497 16.7404 4.73054 16.424 4.95409 16.1276C5.20582 15.7939 5.50466 15.4951 6.10235 14.8974Z"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Link>
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
        <span className="text-sm">{threads.date}</span>

        <div className="flex me-10">
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
