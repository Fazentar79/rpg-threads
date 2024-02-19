import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  // Functions
  const logOut = () => {
    return signOut(auth);
  };

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const reauthenticateUser = (user, credential) => {
    return reauthenticateWithCredential(auth, user, credential);
  };

  const passwordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const deleteUserAccount = (user) => {
    return deleteUser(auth, user);
  };

  const authValue = {
    user,
    loading,
    logOut,
    createUser,
    loginUser,
    reauthenticateUser,
    passwordReset,
    deleteUserAccount,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
