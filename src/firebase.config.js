// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFunctions, httpsCallable} from 'firebase/functions';

// Production
// Copy paste AI4SW Production Cofig here (get it from the firebase console)

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export { functions, httpsCallable };