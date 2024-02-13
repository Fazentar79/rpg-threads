import Button from "../components/Button/Button.jsx";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../store/AuthProvider";
import { useForm } from "react-hook-form";

export default function PasswordReset() {
  // Variables
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { passwordReset } = useContext(AuthContext);
  const { logOut } = useContext(AuthContext);

  // state
  const [loading, setLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState(false);

  // Function
  const onSubmit = async (data) => {
    if (loading) return;

    setLoading(true);
    setEmailMessage(true);
    logOut();
    passwordReset(data.email)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setEmailMessage(false);
        const { code, message } = error;
        if (code === "auth/user-not-found") {
          toast.error("Cet email n'existe pas.");
        } else {
          toast.error(code);
        }
      });
  };

  return (
    <div className="max-w-3xl m-auto">
      {emailMessage ? (
        <h2 className="text-center mt-[100px] font-bold text-2xl">
          Email de réinitialisation de mot de passe envoyé, vérifiez votre boîte
          de réception !
        </h2>
      ) : (
        <>
          <h2 className="my-10 text-center text-3xl font-bold">
            Réinitialiser le mot de passe
          </h2>

          <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5">
                <input
                  className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Adresse e-mail"
                  {...register("email", {
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Entrez une adresse e-mail valide",
                    },
                  })}
                />
                {errors.email &&
                  toast(errors.email.message, { autoClose: 5000 })}
              </div>
              <Button loading={loading}>Réinitialiser le mot de passe</Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}