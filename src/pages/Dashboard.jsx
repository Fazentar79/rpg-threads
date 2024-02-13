import Button from "../components/Button/Button.jsx";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../store/AuthProvider";
import ConnectedLayout from "../layouts/ConnectedLayout.jsx";

export default function Dashboard() {
  // Variables
  const { user } = useContext(AuthContext);
  const { logOut } = useContext(AuthContext);
  const { deleteUserAccount } = useContext(AuthContext);
  const { reauthenticateUser } = useContext(AuthContext);

  // State
  const [loading, setLoading] = useState(false);

  // Functions
  const handleDeleteAccount = async (data) => {
    if (loading) return;

    setLoading(true);
    deleteUserAccount(user)
      .then((userCredential) => {
        setLoading(false);
        console.log("User deleted");
      })
      .catch((error) => {
        setLoading(false);
        const { code, message } = error;
        console.log(code, message);
      });
  };

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
              Pseudo : <span className="font-normal">Pseudo</span>
            </p>
          </div>
          <div className="mt-10 text-center">
            <p className=" hover:text-blue-600 duration-150">
              Modifier le Pseudo
            </p>
            <p className="my-3 hover:text-blue-600 duration-150">
              <Link to="/forgot-password">Modifier le mot de passe</Link>
            </p>
            <p
              onClick={handleDeleteAccount}
              className="text-red-600 hover:font-bold duration-150 cursor-pointer"
            >
              Supprimer le compte
            </p>
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
