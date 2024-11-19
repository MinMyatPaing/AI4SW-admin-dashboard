// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

// Production


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export { functions, httpsCallable };
