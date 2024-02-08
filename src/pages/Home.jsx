import { useEffect } from "react";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../utils/query";

export default function Home() {
  return (
    <main>
      <div className="z-10">
        <p>
          Bienvenue sur la page d'accueil de notre application. Vous pouvez
          naviguer sur les différentes pages en utilisant le menu de navigation.
        </p>
      </div>
    </main>
  );
}
