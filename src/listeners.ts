import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./auth/AuthProvider";

export const initializeAppListeners = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // createUserRecord(user);
      // Other logic for when the user is logged in...
    } else {
      // Logic for when the user is logged out...
    }
  });
};
