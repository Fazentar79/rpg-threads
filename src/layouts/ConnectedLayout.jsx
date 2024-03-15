import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export default function ConnectedLayout({ children }) {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return <div>...</div>;
  }

  if (!loading && !user) {
    navigate("/");
    toast.error("Page réservée aux membres connectés");
    return <div></div>;
  }

  return <>{children}</>;
}

ConnectedLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
