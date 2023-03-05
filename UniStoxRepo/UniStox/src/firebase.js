import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoBkeqTjyi06YFIhFvwSafzXH5wuz9EBY",
  authDomain: "fantom-greenportfolio.firebaseapp.com",
  projectId: "fantom-greenportfolio",
  storageBucket: "fantom-greenportfolio.appspot.com",
  messagingSenderId: "565824760654",
  appId: "1:565824760654:web:15004b9c1ca31c91154c1f",
  measurementId: "G-SR7YY8JSSQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

// Initialize Cloud Firestore and get a reference to the service
