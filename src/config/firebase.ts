import { initializeApp } from 'firebase/app'

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBaAXSnxiCu-sdNVZ0QIc2ldWTrINNLllQ",
  authDomain: "share-hobby.firebaseapp.com",
  projectId: "share-hobby",
  storageBucket: "share-hobby.appspot.com",
  messagingSenderId: "1083173831933",
  appId: "1:1083173831933:web:6744d8e67654ee11fbea94",
  measurementId: "G-JYDGX9QT0C"
}

export const firebaseApp = initializeApp(FIREBASE_CONFIG)

