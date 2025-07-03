// firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATQ3PT-I-nkGd8sI-Srcsy1A-m1Jlezxs",
  authDomain: "gear-aid.firebaseapp.com",
  databaseURL: "https://gear-aid-default-rtdb.firebaseio.com",
  projectId: "gear-aid",
  storageBucket: "gear-aid.appspot.com",
  messagingSenderId: "230179188909",
  appId: "1:230179188909:web:4bb84fd0088d7435c7d624",
  measurementId: "G-9HG844K2SF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Realtime DB instance
export const db = getDatabase(app);

export const storage = getStorage(app);
