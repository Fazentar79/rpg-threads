import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { threadsDb } from "../firebase";
import MakeFormThread from "../components/MakeForm/MakeFormThread.jsx";
import ButtonCancel from "../components/Button/ButtonCancel.jsx";
import ConnectedLayout from "../layouts/ConnectedLayout.jsx";

export default function UpdatedThread() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const message = useRef("");

  const onUpdatedThread = async () => {
    try {
      const threadsDocRef = doc(threadsDb, id);
      if (loading) return;

      setLoading(true);

      await setDoc(
        threadsDocRef,
        {
          message: message.current.value,
          date: serverTimestamp(),
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
    <ConnectedLayout>
      <div className="mt-40">
        <div className="max-w-3xl m-auto">
          <Link to="/">
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
            Modifier le message
          </h1>
          <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5 bg-white">
            <MakeFormThread
              disabled={loading}
              message={message}
              onFormSubmittedHandler={onUpdatedThread}
            />
          </div>
        </div>
      </div>
    </ConnectedLayout>
  );
}
