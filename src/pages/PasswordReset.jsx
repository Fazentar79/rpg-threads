import Button from "../components/Button/Button.jsx";
import { useContext, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../store/AuthProvider";
import { useForm } from "react-hook-form";

export default function PasswordReset() {
  // Variables
  const {
    register,
    handleSubmit,

    defaultFormFields = {
      password: "",
      confirmPassword: "",
    },
    formState: { errors },
  } = useForm();
  const { passwordReset } = useContext(AuthContext);

  // state
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [searchParams] = useSearchParams();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { password, confirmPassword } = formFields;

  let oobCode = searchParams.get("oobCode");

  // Function
  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

  if (password !== confirmPassword) {
    return toast.error("Les mots de passe ne correspondent pas.");
  }

  const onSubmit = async (data) => {
    if (loading) return;

    setLoading(true);
    setSuccessMessage(true);
    console.log(data);
    passwordReset(data.oobCode, data.confirmPassword)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setSuccessMessage(false);
        const { code, message } = error;
        if (code === "auth/invalid-action-code") {
          toast.error("Une erreur est survenue, rééssayez plus tard.");
        } else {
          toast.error(code);
        }
      });

    resetFormFields();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="max-w-3xl m-auto">
      {successMessage ? (
        <div>
          <h2 className="text-center mt-[100px] font-bold text-2xl">
            Mot de passe réinitialisé avec succès !
          </h2>
          <Link to="/dashboard">
            <Button disabled={loading}>Aller à la page de profil</Button>
          </Link>
        </div>
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
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Nouveau mot de passe"
                  value={password}
                  onChange={handleChange}
                  {...register("password", {
                    required: true,
                    minLength: {
                      value: 8,
                      message:
                        "Le mot de passe doit contenir au moins 8 caractères",
                    },
                  })}
                />
              </div>
              <div className="mb-5">
                <input
                  className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={handleChange}
                  {...register("password", {
                    required: true,
                    minLength: {
                      value: 8,
                      message:
                        "Le mot de passe doit contenir au moins 8 caractères",
                    },
                  })}
                />
              </div>
              <Button type="submit" loading={loading}>
                Réinitialiser le mot de passe
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
