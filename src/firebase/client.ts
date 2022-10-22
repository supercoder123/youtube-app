import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyC4eoBC80aEtdnjIgbL4A9vyJqln1w22us",
    authDomain: "lofty-apex-364211.firebaseapp.com",
    projectId: "lofty-apex-364211",
    storageBucket: "lofty-apex-364211.appspot.com",
    messagingSenderId: "613173215258",
    appId: "1:613173215258:web:30b00ade1f947b220891a3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();

export const auth = getAuth();

export const clientDb = getFirestore(app);


