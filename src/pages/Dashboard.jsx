import Button from "../components/Button/Button.jsx";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import ConnectedLayout from "../layouts/ConnectedLayout.jsx";

export default function Dashboard() {
  // Variables
  const { logOut } = useContext(AuthContext);

  return (
    <ConnectedLayout>
      <div>
        <h1>Dashboard</h1>
        <Button onClick={() => logOut()}> Déconnexion </Button>
      </div>
    </ConnectedLayout>
  );
}
