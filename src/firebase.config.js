// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

// Production
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: `${process.env.REACT_APP_PROJECTID}.firebaseapp.com`,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: `${process.env.REACT_APP_PROJECTID}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_MESSAGINGID,
  appId: process.env.REACT_APP_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export { functions, httpsCallable };
