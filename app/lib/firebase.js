import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-4d-2Bz5YWFpOoa2Ce5gV1wOa49BUdC8",
  authDomain: "rainbow-custard.firebaseapp.com",
  projectId: "rainbow-custard",
  storageBucket: "rainbow-custard.appspot.com",
  messagingSenderId: "521715814320",
  appId: "1:521715814320:web:babaaa1c05b18437a35075"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
