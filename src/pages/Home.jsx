import { Link } from "react-router-dom";
import Button from "../components/Button/Button.jsx";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../store/AuthProvider";

export default function Home() {
  return (
    <div>
      <div className="z-10">
        <p>
          Bienvenue sur la page d'accueil de notre application. Vous pouvez
          naviguer sur les différentes pages en utilisant le menu de navigation.
        </p>
      </div>
    </div>
  );
}
