// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5UNJk5X1JtUc0DjHmlEk-FEMslRazGh0",
  authDomain: "carboquant.firebaseapp.com",
  databaseURL: "https://carboquant-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "carboquant",
  storageBucket: "carboquant.firebasestorage.app",
  messagingSenderId: "251962879055",
  appId: "1:251962879055:web:e6c735abd7562c2df24e3a",
  measurementId: "G-ZS90V999JR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const realtimeDb = getDatabase(app);

export { auth, firestore, realtimeDb, analytics };
export default app;