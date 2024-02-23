import Button from "../Button/Button.jsx";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function MakeForm({
  onFormSubmittedHandler,
  message,
  image,
  threads,
  ...props
}) {
  useEffect(() => {
    if (threads) {
      message.current.value = threads.message || "";
      image.current.value = threads.image.other.home.front_default || "";
    }
  }, [threads]);

  const onBeforeSubmitHandler = (e) => {
    e.preventDefault();
    let isValid = true;
    if (!message.current.value) {
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
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          required={true}
          ref={message}
          placeholder="Message"
          className="w-full border p-2 rounded-lg"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="image">Image</label>
        <input
          type="text"
          id="image"
          placeholder="https://..."
          className="w-full border p-2 rounded-lg"
          ref={image}
        />
      </div>
      <Button type="submit" onClick={(e) => onBeforeSubmitHandler(e)}>
        Ajouter un threads
      </Button>
    </form>
  );
}
