import { useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function MakeForm({
  onFormSubmittedHandler,
  pseudo,
  message,
  image,
  threads,
  ...props
}) {
  useEffect(() => {
    if (threads) {
      pseudo.current.value = threads.pseudo;
      message.current.value = threads.message;
      image.current.value = threads.image.other.home.front_default || "";
    }
  }, [threads]);

  const onBeforeSubmitHandler = () => {
    let isValid = true;
    if (!pseudo.current.value || !message.current.value) {
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
        <label htmlFor="pseudo">Pseudo</label>
        <input
          type="text"
          id="pseudo"
          ref={pseudo}
          placeholder="Pseudo"
          className="w-full border p-2 rounded-lg"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
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
      <motion.button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-lg"
        onClick={(e) => onBeforeSubmitHandler(e)}
        initial={{
          opacity: 0.8,
        }}
        whileInView={{
          opacity: 1,
          scale: 1.1,
        }}
      >
        {threads ? "Modifier le threads" : "Ajouter un threads"}
      </motion.button>
    </form>
  );
}
