import {
  collection,
  getFirestore,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../firebase.js";

export const DbContext = createContext(null);

const DbProvider = ({ children }) => {
  const [users, setUsers] = useState(null);
  const [threads, setThreads] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(getFirestore(db), "users");
        const usersSnapshot = await getDocs(usersCollectionRef);

        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        usersData.sort((a, b) => a.pseudo.localeCompare(b.pseudo));

        setUsers(usersData);
        setLoadingUsers(false);
      } catch (error) {
        console.error("Une erreur est survenue : ", error.message);
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const addPseudo = async (pseudo) => {
    try {
      const userCollectiionRef = collection(getFirestore(), "users");
      const userDocRef = doc(userCollectiionRef, pseudo);
      await setDoc(userDocRef, {
        userPseudo: pseudo,
      });
    } catch (error) {
      console.error("Une erreur est survenue : ", error.message);
    }
  };

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

        threadsData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

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
    threads,
    loadingUsers,
    addPseudo,
    addThread,
  };

  return <DbContext.Provider value={dbValue}>{children}</DbContext.Provider>;
};

export default DbProvider;
