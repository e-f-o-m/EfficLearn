import { initializeApp } from 'firebase/app';
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  projectId: "efficlearn",
  appId: "1:579175726302:web:0a579736652e6552d6964f",
  databaseURL: "https://efficlearn-default-rtdb.firebaseio.com",
  storageBucket: "efficlearn.appspot.com",
  apiKey: "AIzaSyCfj2bFLVFdKhWieOSITjn-QEmmAv3DU7I",
  authDomain: "efficlearn.firebaseapp.com",
  messagingSenderId: "579175726302"
};

// Inicializar Firebase App
export const firebaseApp = initializeApp(firebaseConfig);

// Módulos Firebase
export const auth = getAuth(firebaseApp);
export const db = getDatabase(firebaseApp);

// Persistencia (mantiene sesión)
setPersistence(auth, browserLocalPersistence).catch(console.error);
