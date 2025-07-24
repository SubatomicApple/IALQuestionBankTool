//FireBase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZZNiq1B-Z0H7xkHGutKRVdkBs_Bri2As",
  authDomain: "ialquestionbanktool.firebaseapp.com",
  projectId: "ialquestionbanktool",
  storageBucket: "ialquestionbanktool.firebasestorage.app",
  messagingSenderId: "549406244081",
  appId: "1:549406244081:web:87b616e0d06b3ec7ae3d50",
  measurementId: "G-NBNS11J8FF"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
//