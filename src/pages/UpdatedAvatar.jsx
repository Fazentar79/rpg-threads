import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../store/AuthProvider";
import { usersDb } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore";
import ButtonCancel from "../components/Button/ButtonCancel.jsx";
import MakeFormAvatar from "../components/MakeForm/MakeFormAvatar.jsx";
import ConnectedLayout from "../layouts/ConnectedLayout.jsx";

export default function UpdatedAvatar() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const avatarAccount = useRef("");

  const handleAvatar = async () => {
    try {
      const userDocRef = doc(usersDb, user.uid);

      if (loading) return;

      setLoading(true);

      await setDoc(
        userDocRef,
        {
          avatar: avatarAccount.current.value,
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
    <ConnectedLayout>
      <div className="max-w-3xl m-auto mt-40">
        <Link to="/dashboard">
          <ButtonCancel>
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 12H18M6 12L11 7M6 12L11 17"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ButtonCancel>
        </Link>
        <h1 className="text-3xl font-bold text-center my-10">
          Ajouter / Modifier un avatar
        </h1>
        <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5 bg-white">
          <MakeFormAvatar
            disabled={loading}
            avatar={avatarAccount}
            onFormSubmittedHandler={handleAvatar}
            label="Nouvel avatar"
            type="text"
          />
        </div>
      </div>
    </ConnectedLayout>
  );
}
