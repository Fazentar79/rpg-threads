import MakeFormPseudo from "../components/MakeForm/MakeFormPseudo.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../store/AuthProvider";
import { usersDb } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore";
import ButtonCancel from "../components/Button/ButtonCancel.jsx";

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
      <div className="max-w-3xl m-auto bg-white">
        <Link to="/dashboard">
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
