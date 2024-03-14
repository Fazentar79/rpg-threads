import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="w-full bottom-0">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{
          type: "spring",
        }}
        initial="hidden"
        animate="visible"
        className="flex justify-center mx-10 my-5 p-3 shadow-lg shadow-black bg-white rounded-3xl"
      >
        © 2024 - Frédéric Hot
      </motion.div>
    </footer>
  );
}
