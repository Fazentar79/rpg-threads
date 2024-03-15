import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-IsS6KsdBm7sXXlVr_cv7qY-Pi9G5CnA",
  authDomain: "rpg-threads.firebaseapp.com",
  projectId: "rpg-threads",
  storageBucket: "rpg-threads.appspot.com",
  messagingSenderId: "315497241313",
  appId: "1:315497241313:web:53c26c17b28189020235a0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const usersDb = collection(db, "users");

export const threadsDb = collection(db, "threads");

export const commentsDb = collection(db, "comments");
