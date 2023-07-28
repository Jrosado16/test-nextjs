import { initializeApp, getApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"

const firebaseConfig = {
  apiKey: "AIzaSyD0ofa4HxRPHAQkX4RMUOhxv3Q-e8fhWKQ",
  authDomain: "zk-tropykus.firebaseapp.com",
  projectId: "zk-tropykus",
  storageBucket: "zk-tropykus.appspot.com",
  messagingSenderId: "198944461377",
  appId: "1:198944461377:web:01b86cda309db137c82cc0",
  measurementId: "G-7M2N08K5G4"
};

initializeApp(firebaseConfig)

const db = getFirestore()

export const functions = getFunctions(getApp())

// For development purposes
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectFunctionsEmulator(functions, 'localhost', 5001)
}

export default db