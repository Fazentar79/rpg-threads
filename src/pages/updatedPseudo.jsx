import MakeFormPseudo from "../components/MakeForm/MakeFormPseudo.jsx";
import { useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../store/AuthProvider";
import { usersDb } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore";

export default function UpdatedPseudo() {
  // Variable
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // States
  const [loading, setLoading] = useState(false);

  // Refs
  const pseudoAccount = useRef("");

  // Functions

  const handleNewPseudo = async () => {
    try {
      const userDocRef = doc(usersDb, user.uid);

      if (loading) return;

      setLoading(true);

      await setDoc(
        userDocRef,
        {
          pseudo: pseudoAccount.current.value,
        },
        { merge: true },
      );

      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <>
      <div className="max-w-3xl m-auto">
        <h1 className="text-3xl font-bold text-center my-10">
          Changer de pseudo
        </h1>
        <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5">
          <MakeFormPseudo
            disabled={loading}
            pseudo={pseudoAccount}
            onFormSubmittedHandler={handleNewPseudo}
          />
        </div>
      </div>
    </>
  );
}
