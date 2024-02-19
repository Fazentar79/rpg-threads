import { Link } from "react-router-dom";
import Button from "../components/Button/Button.jsx";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthContext } from "../store/AuthProvider";

export default function DeleteUserAccount() {
  // Variables
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user } = useContext(AuthContext);
  const { deleteUserAccount } = useContext(AuthContext);
  const { reauthenticateUser } = useContext(AuthContext);

  // State
  const [loading, setLoading] = useState(false);

  // Functions

  const handleReauthenticate = async (data) => {
    if (loading) return;

    setLoading(true);
    reauthenticateUser(data.user, data.credential)
      .then((UserCredential) => {
        setLoading(false);
        console.log("User reauthenticated");
      })
      .catch((error) => {
        setLoading(false);
        const { code, message } = error;
        console.log(code, message);
      });
  };

  // const handleDeleteAccount = async (data) => {
  //   if (loading) return;
  //
  //   setLoading(true);
  //   deleteUserAccount(data.user)
  //     .then(() => {
  //       setLoading(false);
  //       console.log("User deleted");
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       const { code, message } = error;
  //       console.log(code, message);
  //     });
  // };

  return (
    <div>
      <div className="max-w-3xl m-auto">
        <h1 className="my-10 text-center text-3xl font-bold">
          Rentrez votre mot de passe pour supprimer votre compte :
        </h1>
        <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5">
          <form
            className="flex flex-col space-y-5"
            onSubmit={handleSubmit(handleReauthenticate)}
          >
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full border mb-5 p-2 rounded-lg"
              {...register("password", {
                required: true,
                minLength: {
                  value: 8,
                  message:
                    "Le mot de passe doit contenir au moins 8 caractères",
                },
              })}
            />
            <Button
              type="submit"
              loading={loading}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer mon compte
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
