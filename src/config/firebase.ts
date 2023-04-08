import { initializeApp } from 'firebase/app'

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBaAXSnxiCu-sdNVZ0QIc2ldWTrINNLllQ",
  authDomain: "share-hobby.firebaseapp.com",
  projectId: "share-hobby",
  storageBucket: "share-hobby.appspot.com",
  messagingSenderId: "1083173831933",
  appId: "1:1083173831933:web:6744d8e67654ee11fbea94",
  measurementId: "G-JYDGX9QT0C"
  //TODO: Improve security
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // appId: process.env.REACT_APP_FIREBASE_ID,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
}

export const firebase = initializeApp(FIREBASE_CONFIG)

