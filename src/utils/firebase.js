// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCq_YiapSA20USMxmtd4vUO1AyCNyrJns",
  authDomain: "facebook-2fcda.firebaseapp.com",
  databaseURL: "https://facebook-2fcda-default-rtdb.firebaseio.com",
  projectId: "facebook-2fcda",
  storageBucket: "facebook-2fcda.appspot.com", // FIXED
  messagingSenderId: "57281080679",
  appId: "1:57281080679:web:7009d9a0f34523f16b93c2",
  measurementId: "G-M58P20VH0J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Prevent Analytics error in SSR (Next.js)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db, doc, setDoc };
