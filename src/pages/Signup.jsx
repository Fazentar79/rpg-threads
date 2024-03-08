import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState, useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { usersDb } from "../firebase";

export default function Signup(content, options) {
  //Variables
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser } = useContext(AuthContext);

  //State
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (loading) return;

    setLoading(true);

    createUser(data.email, data.password)
      .then((userCredential) => {
        setDoc(doc(usersDb, userCredential.user.uid), {
          pseudo: data.pseudo,
          email: data.email,
          userId: userCredential.user.uid,
          date: serverTimestamp(),
        });
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        setLoading(false);
        const { code } = error;
        if (code === "auth/email-already-in-use") {
          toast.error("Cet email est déjà utilisé.");
        } else {
          toast.error(code);
        }
      });
  };

  return (
    <div className="flex flex-col mt-[100px] items-center">
      <div className="shadow-lg shadow-black p-7 m-5 rounded-3xl">
        <div className="text-center text-lg mb-5">
          S'inscrire sur Rpg Threads
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
            type="text"
            placeholder="Pseudo"
            className="w-full border mb-5 p-2 rounded-lg"
            {...register("pseudo", {
              required: true,
              minLength: {
                value: 5,
                message: "Le pseudo doit contenir au moins 5 caractères",
              },
              maxLength: {
                value: 20,
                message: "Le pseudo doit contenir au maximum 20 caractères",
              },
            })}
          />
          {errors.pseudo && toast(errors.pseudo.message, { autoClose: 5000 })}
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full border mb-5 p-2 rounded-lg"
            {...register("password", {
              required: true,
              minLength: {
                value: 8,
                message: "Le mot de passe doit contenir au moins 8 caractères",
              },
            })}
          />
          {errors.password &&
            toast(errors.password.message, { autoClose: 5000 })}
          <Button disabled={loading}>S'inscrire</Button>
        </form>

        {/* Pass */}
        <div className="flex justify-center mt-5">
          <div className="cursor-pointer hover:text-blue-600 duration-150">
            <Link to="/signin">Déjà un compte ?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
