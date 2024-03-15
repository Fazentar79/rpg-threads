import { Link } from "react-router-dom";
import Button from "../components/Button/Button.jsx";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthContext } from "../store/AuthProvider";

export default function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { loginUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    if (loading) return;

    setLoading(true);

    loginUser(data.email, data.password)
      .then((userCredential) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const { code } = error;
        if (code === "auth/user-not-found") {
          toast.error("Cet email n'existe pas.");
        } else if (code === "auth/invalid-credential") {
          toast.error("La combinaison est incorrecte.");
        } else {
          toast.error(code);
        }
      });
  };

  return (
    <div className="m-auto flex-col mt-40 max-w-3xl">
      <div className="shadow-lg shadow-black p-7 m-5 rounded-3xl">
        <div className="text-center text-lg mb-5">
          Se connecter sur Rpg Threads
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Adresse e-mail"
            className={`w-full border mb-5 p-2 rounded-lg ${errors.email && "bg-red-50"}`}
            {...register("email", {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Entrez une adresse e-mail valide",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mb-10">{errors.email.message}</p>
          )}
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full border mb-5 p-2 rounded-lg"
            {...register("password", {
              required: true,
              minLength: {
                value: 8,
                message:
                  "Votre mot de passe doit contenir au moins 8 caractères",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-400 text-xs mb-10">
              {errors.password.message}
            </p>
          )}
          <Button disabled={loading} onClick={handleSubmit(onSubmit)}>
            Se connecter
          </Button>
        </form>

        <div className="text-center mt-5">
          <div className="hover:text-blue-600 duration-150">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>

          <hr className="my-5" />

          <div className="hover:text-blue-600 duration-150">
            <Link to="/signup">Pas de compte ?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
