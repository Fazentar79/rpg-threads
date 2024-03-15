import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer";
import { Outlet, useNavigation } from "react-router-dom";

export default function Main() {
  const navigation = useNavigation();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <Header />

        {navigation.state === "loading" ? (
          <div className="flex justify-center mt-1">Chargement...</div>
        ) : (
          <Outlet />
        )}
      </div>

      <Footer />
    </div>
  );
}
