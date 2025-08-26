// src/firebaseConfig.js
// Anchors: [UNI:FIREBASE:IMPORTS] [UNI:FIREBASE:APP] [UNI:FIREBASE:AUTH] [UNI:FIREBASE:EXPORTS]

/* [UNI:FIREBASE:IMPORTS] */
import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// [UNI:CONFIG] ⬇️ Replace with your real Firebase config
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZz5e2lH2RLo-lmefZJPWW2PjyfhL4P6k",
    authDomain: "uni-mvp.firebaseapp.com",
    projectId: "uni-mvp",
    storageBucket: "uni-mvp.appspot.com",
    messagingSenderId: "573518415288",
    appId: "1:573518415288:web:866da30e4b84d480c07b4d"
};

const app = initializeApp(firebaseConfig);

/* [UNI:FIREBASE:AUTH] */
const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });

const db = getFirestore(app);

/* [UNI:FIREBASE:EXPORTS] */
export { app, auth, db };