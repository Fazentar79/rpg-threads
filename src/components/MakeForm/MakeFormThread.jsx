import Button from "../Button/Button.jsx";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function MakeFormThread({
  onFormSubmittedHandler,
  message,
  threads,
  ...props
}) {
  useEffect(() => {
    if (threads) {
      message.current.value = threads.message || "";
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
          ref={message}
          placeholder="Message"
          className="w-full border p-2 rounded-lg"
        />
      </div>
      <Button type="submit" onClick={(e) => onBeforeSubmitHandler(e)}>
        Modifier le thread
      </Button>
    </form>
  );
}
