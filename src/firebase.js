import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkscwnqiiV16mKRJdEQ4v346crgstMeZQ",
  authDomain: "chat-84cac.firebaseapp.com",
  projectId: "chat-84cac",
  storageBucket: "chat-84cac.appspot.com",
  messagingSenderId: "342783558479",
  appId: "1:342783558479:web:c0b3da72ef979df37a3b3a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
