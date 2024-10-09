import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBYi0mQFnmZRd6YsuFcRZrTAi-C_rdLGfY",
    authDomain: "foculy-240fe.firebaseapp.com",
    projectId: "foculy-240fe",
    storageBucket: "foculy-240fe.appspot.com",
    messagingSenderId: "748459295123",
    appId: "1:748459295123:web:321be4d4d90ae04f0de866",
    measurementId: "G-FZGJYMJX14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Auth, and Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };


