import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { getDocs } from "firebase/firestore";
import { usersDb } from "../../firebase.js";

export default function Messagecard({ ref, threads, ...props }) {
  //Variables
  const { user } = useContext(AuthContext);

  //States
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [pseudo, setPseudo] = useState([]);

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
    if (threads.image) {
      setShowImage(true);
    }
  }, [threads.image]);

  return (
    <div
      ref={ref}
      className={`flex flex-col p-5 mx-5 my-10 rounded-3xl shadow-2xl shadow-black `}
    >
      <div className="flex flex-col gap-1">
        <span className="text-lg font-bold border-b py-5">
          {threads.pseudo}
        </span>
        <span className="text-sm border-b py-5">{threads.message}</span>
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
      <div>
        <span className="text-sm">{threads.date}</span>
      </div>
    </div>
  );
}
