import { useRef, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { threadsDb } from "../firebase";
import { AuthContext } from "../store/AuthProvider";
import MakeFormThread from "../components/MakeForm/MakeFormThread.jsx";
import ButtonCancel from "../components/Button/ButtonCancel.jsx";

export default function UpdatedThread() {
  // Variable
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  // States
  const [loading, setLoading] = useState(false);
  const [updateThread, setUpdateThread] = useState(false);

  // Refs
  const image = useRef("");
  const message = useRef("");

  // Functions

  const onUpdatedThread = async () => {
    try {
      const threadsDocRef = doc(threadsDb, id);
      if (loading) return;

      setLoading(true);

      await setDoc(
        threadsDocRef,
        {
          message: message.current.value,
          date: new Date().toLocaleString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
        },
        { merge: true },
      );

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div className="max-w-3xl m-auto">
      <Link to="/" className="absolute left-0 top-[100px] ms-10">
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
        Modifier le thread
      </h1>
      <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5">
        <MakeFormThread
          disabled={loading}
          message={message}
          onFormSubmittedHandler={onUpdatedThread}
        />
      </div>
    </div>
  );
}
