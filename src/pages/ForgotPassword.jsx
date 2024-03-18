import Button from "../components/Button/Button.jsx";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../store/AuthProvider";
import { useForm } from "react-hook-form";
import ButtonCancel from "../components/Button/ButtonCancel.jsx";
import { Link } from "react-router-dom";

export default function PasswordReset() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { passwordReset } = useContext(AuthContext);
  const { logOut } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState(false);

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
        const { code } = error;
        if (code === "auth/user-not-found") {
          toast.error("Cet email n'existe pas.");
        } else {
          toast.error(code);
        }
      });
  };

  return (
    <div className="max-w-3xl m-auto mt-40">
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

          <div className="shadow-2xl shadow-black rounded-3xl p-5 m-5 bg-white">
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
                  autoFocus={true}
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
