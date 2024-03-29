import { useRef, useState, useContext, useEffect } from "react";
import MakeForm from "../components/MakeForm/MakeForm.jsx";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { threadsDb, usersDb } from "../firebase";
import { AuthContext } from "../store/AuthProvider";
import ButtonCancel from "../components/Button/ButtonCancel.jsx";
import ConnectedLayout from "../layouts/ConnectedLayout.jsx";
import { toast } from "react-toastify";

export default function AddThread() {
  //Variables
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  //States
  const [loading, setLoading] = useState(false);
  const [pseudo, setPseudo] = useState([]);

  // Refs
  const image = useRef("");
  const message = useRef("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userSnapshot = await getDocs(usersDb);

        const userData = userSnapshot.docs
          .find((doc) => {
            return doc.data().userId === user.uid;
          })
          ?.data();
        const userPseudo = userData?.pseudo;

        setPseudo(userPseudo);
        setLoading(false);
      } catch (error) {
        console.error("Une erreur est survenue : ", error);
        setLoading(false);
      }

      setLoading(false);
    };

    fetchUserData().then();
  }, []);

  //Post a new thread
  const onCreateNewThread = async () => {
    if (loading) return;

    try {
      await addDoc(threadsDb, {
        pseudo: pseudo,
        userId: user.uid,
        image: image.current.value,
        message: message.current.value,
        date: serverTimestamp(),
      });

      setLoading(false);
      navigate("/");
      toast("Votre message à bien été posté", { type: "success" });
    } catch (error) {
      console.error("Une erreur est survenue : ", error);
      setLoading(false);
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
            Créer un nouveau thread
          </h1>
          <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5 bg-white">
            <MakeForm
              disabled={loading}
              image={image}
              message={message}
              onFormSubmittedHandler={onCreateNewThread}
            />
          </div>
        </div>
      </div>
    </ConnectedLayout>
  );
}
