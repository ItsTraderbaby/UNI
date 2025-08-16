// src/firebaseConfig.js
// [UNI:IMPORTS]
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// [UNI:CONFIG] ⬇️ Replace with your real Firebase config
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZz5e2lH2RLo-lmefZJPWW2PjyfhL4P6k",
    authDomain: "uni-mvp.firebaseapp.com",s
    projectId: "uni-mvp",
    storageBucket: "uni-mvp.firebasestorage.app",
    messagingSenderId: "573518415288",
    appId: "1:573518415288:web:866da30e4b84d480c07b4d"
};

// [UNI:APP]
const app = initializeApp(firebaseConfig);

// [UNI:EXPORTS]
export const auth = getAuth(app);
export const db = getFirestore(app);
