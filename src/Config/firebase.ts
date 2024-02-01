// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

//This tells Firebase we will be using authentication in our project
import { getAuth, GoogleAuthProvider } from "firebase/auth";

//Allows us to use functionalities of a firestore database
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATuaLt4K6oA_-6_k0DCrxPRWTCbEF2n84",
  authDomain: "reactsocialmediaapp-b1ffb.firebaseapp.com",
  projectId: "reactsocialmediaapp-b1ffb",
  storageBucket: "reactsocialmediaapp-b1ffb.appspot.com",
  messagingSenderId: "172186418422",
  appId: "1:172186418422:web:c3a6f19ff5f1a72cca40d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initializing the authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const database = getFirestore(app);