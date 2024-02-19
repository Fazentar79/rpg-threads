import Button from "../components/Button/Button.jsx";
import MakeFormPseudo from "../components/MakeForm/MakeFormPseudo.jsx";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useContext } from "react";
import { DbContext } from "../store/DbProvider.jsx";
import { toast } from "react-toastify";

export default function CreatePseudo() {
  // Variable
  const navigate = useNavigate();
  const { addPseudo } = useContext(DbContext);

  // States
  const [loading, setLoading] = useState(false);

  // Refs
  const pseudo = useRef("");

  // Functions
  const onCreateNewPseudo = async (data) => {
    if (loading) return;

    setLoading(true);

    addPseudo(data.pseudo)
      .then(() => {
        setLoading(false);
        navigate("/dashboard");
        console.log("Pseudo créé avec succès");
      })
      .catch((error) => {
        setLoading(false);
        toast(error.message);
      });
  };

  return (
    <div>
      <MakeFormPseudo pseudo={pseudo} />
      <Button type="submit" disabled={loading} onClick={onCreateNewPseudo}>
        Envoyer le nouveau pseudo
      </Button>
    </div>
  );
}
