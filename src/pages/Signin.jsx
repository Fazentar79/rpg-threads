import { Link } from "react-router-dom";
import Button from "../components/Button/Button.jsx";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthContext } from "../store/AuthProvider";

export default function Signin() {
  // Variables
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { loginUser } = useContext(AuthContext);

  // State
  const [loading, setLoading] = useState(false);

  // Function
  const onSubmit = (data) => {
    if (loading) return;

    setLoading(true);

    loginUser(data.email, data.password)
      .then((userCredential) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const { code, message } = error;
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
    <>
      <div className="flex flex-col mt-[100px] items-center">
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
            {errors.email && toast(errors.email.message, { autoClose: 5000 })}
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
            {errors.password &&
              toast(errors.password.message, { autoClose: 5000 })}
            <Button disabled={loading}>Se connecter</Button>
          </form>

          {/* Pass */}
          <div className="text-center mt-5">
            <div className="hover:text-blue-600 duration-150">
              <Link to="/forgot-password">Mot de passe oublié ?</Link>
            </div>

            {/* Separator */}
            <hr className="my-5" />

            {/* Sign */}
            <div className="hover:text-blue-600 duration-150">
              <Link to="/signup">Pas de compte ?</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
