import { useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button/Button.jsx";
import PropTypes from "prop-types";

export default function MakeFormPseudo({
  onFormSubmittedHandler,
  pseudo,
  pseudoAccount,
  ...props
}) {
  useEffect(() => {
    if (pseudoAccount) {
      pseudo.current.value = pseudoAccount.pseudo;
    }
  }, [pseudoAccount]);

  const onBeforeSubmitHandler = (e) => {
    e.preventDefault();
    let isValid = true;
    if (!pseudo.current.value) {
      isValid = false;
    }

    if (isValid) {
      onFormSubmittedHandler();
    } else {
      toast.error("Veuillez remplir tous les champs du formulaire.");
    }
  };

  return (
    <form onSubmit={(e) => onBeforeSubmitHandler(e)}>
      <div className="mb-5">
        <input
          type="text"
          id="pseudo"
          required={true}
          ref={pseudo}
          placeholder="Pseudo"
          className="w-full border p-2 rounded-lg"
          autoFocus={true}
        />
      </div>
      <Button type="submit" onClick={(e) => onBeforeSubmitHandler(e)}>
        Envoyer le nouveau pseudo
      </Button>
    </form>
  );
}

MakeFormPseudo.propTypes = {
  onFormSubmittedHandler: PropTypes.func.isRequired,
  pseudo: PropTypes.object.isRequired,
  pseudoAccount: PropTypes.object.isRequired,
};
