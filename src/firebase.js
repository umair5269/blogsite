// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_MPNraDgv3zqwbROhdJu8kNChv1hoWoQ",
  authDomain: "new-blog-site-a419e.firebaseapp.com",
  projectId: "new-blog-site-a419e",
  storageBucket: "new-blog-site-a419e.firebasestorage.app",
  messagingSenderId: "320712785394",
  appId: "1:320712785394:web:2974fda380d68289403f6b",
  measurementId: "G-10BC5BWQGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();