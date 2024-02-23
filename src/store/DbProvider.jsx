import {
  collection,
  getFirestore,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { createContext, useEffect, useState, useContext } from "react";
import { usersDb } from "../firebase.js";
import { AuthContext } from "./AuthProvider";

export const DbContext = createContext(null);

//Variables
// const { user } = useContext(AuthContext);

const DbProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [pseudo, setPseudo] = useState([]);
  const [creationDate, setCreationDate] = useState([]);
  const [threads, setThreads] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // users

  // Threads
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const database = getFirestore();
        const threadsCollectionRef = collection(database, "threads");
        const threadsSnapshot = await getDocs(threadsCollectionRef);

        const threadsData = threadsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setThreads(threadsData);
      } catch (error) {
        console.error("Une erreur est survenue : ", error.message);
      }
    };
  }, []);

  const addThread = async (updatedThread, message, image) => {
    try {
      const threadsCollectionRef = collection(getFirestore(), "threads");
      const threadDocRef = doc(threadsCollectionRef, updatedThread.uid);
      await setDoc(threadDocRef, {
        threadId: updatedThread.uid,
        threadMessage: updatedThread.message,
        threadImage: updatedThread.image,
        threadTimestamp: new Date(),
      });
    } catch (error) {
      console.error("Une erreur est survenue : ", error.message);
    }
  };

  const dbValue = {
    users,
    pseudo,
    threads,
    loadingUsers,
    addThread,
  };

  return <DbContext.Provider value={dbValue}>{children}</DbContext.Provider>;
};

export default DbProvider;
