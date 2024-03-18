import { useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button/Button.jsx";
import PropTypes from "prop-types";

export default function MakeFormAvatar({
  onFormSubmittedHandler,
  avatar,
  avatarAccount,
  ...props
}) {
  useEffect(() => {
    if (avatarAccount) {
      avatar.current.value = avatarAccount.avatar;
    }
  }, [avatarAccount]);

  const onBeforeSubmitHandler = (e) => {
    e.preventDefault();
    let isValid = true;
    if (!avatar.current.value) {
      isValid = false;
    }

    if (isValid) {
      onFormSubmittedHandler();
    } else {
      toast.error("Veuillez ajouter un Avatar.");
    }
  };

  return (
    <form onSubmit={(e) => onBeforeSubmitHandler(e)}>
      <div className="mb-5">
        <input
          type="text"
          id="avatar"
          required={true}
          ref={avatar}
          placeholder="Avatar"
          className="w-full border p-2 rounded-lg"
          autoFocus={true}
        />
      </div>
      <Button type="submit" onClick={(e) => onBeforeSubmitHandler(e)}>
        Envoyer l' avatar
      </Button>
    </form>
  );
}

MakeFormAvatar.propTypes = {
  onFormSubmittedHandler: PropTypes.func.isRequired,
  avatar: PropTypes.object.isRequired,
  avatarAccount: PropTypes.object.isRequired,
};
