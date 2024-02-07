import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer";
import { Outlet, useNavigation } from "react-router-dom";

export default function Main() {
  // Variable
  const navigation = useNavigation();

  return (
    <>
      <div className="flex flex-col text-center h-screen">
        <div className="flex-1">
          <div className="grid grid-cols-2">
            {/* Header */}
            <Header />
            {/* Loading */}
            {navigation.state === "loading" ? (
              <div className="flex justify-center mt-1">Chargement...</div>
            ) : (
              // Outlet
              <Outlet />
            )}
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
