import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCd-Uw8Kic6dxnO23DJLqU-YkX5h6AAXVc",
  authDomain: "familycalendar-2a3ec.firebaseapp.com",
  projectId: "familycalendar-2a3ec",
  storageBucket: "familycalendar-2a3ec.appspot.com",
  messagingSenderId: "14345022929",
  appId: "1:14345022929:web:95865b4a91da102df204f0",
  measurementId: "G-F31QZYVMD2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);