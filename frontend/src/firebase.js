import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQBfcIy5baYFkT-PT0tQt5DLX-P8MLpys",
  authDomain: "tnscheme-ai-dsu-oneyes.firebaseapp.com",
  projectId: "tnscheme-ai-dsu-oneyes",
  storageBucket: "tnscheme-ai-dsu-oneyes.firebasestorage.app",
  messagingSenderId: "1003466854657",
  appId: "1:1003466854657:web:63398de5a1b95616cbcb00",
  measurementId: "G-JGR9Z7PK95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics safely (handles ad blockers and environments where indexedDB/analytics is restricted)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { app, analytics, db };
export default app;
