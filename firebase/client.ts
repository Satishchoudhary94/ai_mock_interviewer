// Import the functions you need from the SDKs you need

// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhtF-gDPnH54kr6irQ_JmIjHukWM3gGpY",
  authDomain: "mock-ai-820e6.firebaseapp.com",
  projectId: "mock-ai-820e6",
  storageBucket: "mock-ai-820e6.firebasestorage.app",
  messagingSenderId: "721619197191",
  appId: "1:721619197191:web:0e418a52b9e8ae64b2f9a2",
  measurementId: "G-411JSZ97EE"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);