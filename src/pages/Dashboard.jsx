import Button from "../components/Button/Button.jsx";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../store/AuthProvider";
import ConnectedLayout from "../layouts/ConnectedLayout.jsx";
import { usersDb } from "../firebase";
import { getDocs } from "firebase/firestore";

export default function Dashboard() {
  // Variables
  const { user } = useContext(AuthContext);
  const { logOut } = useContext(AuthContext);
  const { deleteUserAccount } = useContext(AuthContext);

  // State
  const [loading, setLoading] = useState(false);
  const [pseudo, setPseudo] = useState([]);
  const [creationDate, setCreationDate] = useState([]);

  //Functions

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userSnapshot = await getDocs(usersDb);

        const currentUserPseudo = userSnapshot.docs.map((doc) => {
          if (doc.data().userId === user.uid) {
            pseudo.push(doc.data().pseudo);
            return doc.data().pseudo;
          }
        });

        const currentUserCreationDate = userSnapshot.docs.map((doc) => {
          if (doc.data().userId === user.uid) {
            creationDate.push(doc.data().date);
            return doc.data().date;
          }
        });

        setPseudo(currentUserPseudo);
        setCreationDate(currentUserCreationDate);
        setLoading(false);
      } catch (error) {
        console.error("Une erreur est survenue : ", error);
        setLoading(false);
      }
    };

    fetchUsers().then((r) => r);
  }, []);

  return (
    <ConnectedLayout>
      <div className="max-w-3xl m-auto">
        <h1 className="my-10 text-center text-3xl font-bold">Profil</h1>
        <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5">
          <div className="text-center">
            <p className="font-bold">
              Email : <span className="font-normal">{user.email}</span>
            </p>
            <p className="font-bold">
              Pseudo : <span className="font-normal"> {pseudo} </span>
            </p>
            <p className="font-bold">
              Création du compte :
              <span className="font-normal"> {user.metadata.creationTime}</span>
            </p>
          </div>
          <div className="mt-10 text-center">
            <p className=" hover:text-blue-600 duration-150">
              <Link to="/updated-pseudo">Modifier le Pseudo</Link>
            </p>
            <p className="my-3 hover:text-blue-600 duration-150">
              <Link to="/forgot-password">Modifier le mot de passe</Link>
            </p>
            <Link
              to="/delete-account"
              className="text-red-600 hover:font-bold duration-150 cursor-pointer"
            >
              Supprimer le compte
            </Link>
          </div>
          <div className="mt-10">
            <Button onClick={() => logOut()}> Déconnexion </Button>
          </div>
        </div>
        <div>
          <h2 className="my-10 text-center text-2xl font-bold">Mes Threads</h2>
          <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5 flex flex-col justify-center items-center">
            <p>Vous n'avez pas encore de threads</p>
          </div>
        </div>
      </div>
    </ConnectedLayout>
  );
}
