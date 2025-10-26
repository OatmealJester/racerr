// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_API_KEY } from "../api/key";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "racerr-605cc.firebaseapp.com",
  projectId: "racerr-605cc",
  storageBucket: "racerr-605cc.firebasestorage.app",
  messagingSenderId: "911704807731",
  appId: "1:911704807731:web:64e58d56f96df0725e0646",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// database context
export const database = getFirestore(app)