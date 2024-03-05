import { useRef, useState, useContext } from "react";
import MakeForm from "../components/MakeForm/MakeForm.jsx";
import { Link, useNavigate } from "react-router-dom";
import { doc, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { threadsDb, usersDb } from "../firebase";
import { AuthContext } from "../store/AuthProvider";
import ButtonCancel from "../components/Button/ButtonCancel.jsx";

export default function AddThread() {
  //Variables
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  //States
  const [loading, setLoading] = useState(false);
  const [pseudo, setPseudo] = useState([]);
  const [createNewThread, setCreateNewThread] = useState(false);

  // Refs
  const image = useRef("");
  const message = useRef("");

  const fetchUserPseudo = async () => {
    try {
      const userSnapshot = await getDocs(usersDb);

      const currentUserPseudo = userSnapshot.docs.map((doc) => {
        if (doc.data().userId === user.uid) {
          pseudo.push(doc.data().pseudo);
          return doc.data().pseudo;
        }
      });
      setLoading(false);
    } catch (error) {
      console.error("Une erreur est survenue : ", error);
      setLoading(false);
    }

    onCreateNewThread(pseudo);
  };

  //Post a new thread
  const onCreateNewThread = async () => {
    try {
      const threadsDocRef = doc(threadsDb);

      await addDoc(threadsDb, {
        pseudo: pseudo,
        userId: user.uid,
        image: image.current.value,
        message: message.current.value,
        date: serverTimestamp(),
      });
      setLoading(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Une erreur est survenue : ", error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl m-auto">
      <Link to="/">
        <ButtonCancel>
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 12H18M6 12L11 7M6 12L11 17"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </ButtonCancel>
      </Link>
      <h1 className="text-3xl font-bold text-center my-10">
        Créer un nouveau thread
      </h1>
      <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5">
        <MakeForm
          disabled={loading}
          image={image}
          message={message}
          onFormSubmittedHandler={fetchUserPseudo}
        />
      </div>
    </div>
  );
}
