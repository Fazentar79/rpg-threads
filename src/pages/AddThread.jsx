import { useEffect, useRef, useState, useContext } from "react";
import MakeForm from "../components/MakeForm/MakeForm.jsx";
import { useNavigate } from "react-router-dom";
import { getDocs, doc, setDoc, addDoc, collection } from "firebase/firestore";
import { threadsDb, usersDb } from "../firebase";
import { AuthContext } from "../store/AuthProvider";

export default function AddThread() {
  //Variables
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  //States
  const [loading, setLoading] = useState(false);
  const [createNewThread, setCreateNewThread] = useState(false);

  // Refs
  const image = useRef("");
  const message = useRef("");

  //Post a new thread
  const onCreateNewThread = async () => {
    try {
      const threadsDocRef = doc(threadsDb);

      await addDoc(threadsDb, {
        image: image.current.value,
        message: message.current.value,
        date: new Date().toLocaleString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      });
      console.log("Document successfully written!");
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Une erreur est survenue : ", error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl m-auto">
      <h1 className="text-3xl font-bold text-center my-10">
        Créer un nouveau thread
      </h1>
      <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5">
        <MakeForm
          disabled={loading}
          image={image}
          message={message}
          onFormSubmittedHandler={onCreateNewThread}
        />
      </div>
    </div>
  );
}
