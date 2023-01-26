
export const config = {
  firebaseConfig: {
    apiKey: "AIzaSyBaAXSnxiCu-sdNVZ0QIc2ldWTrINNLllQ",
    authDomain: "share-hobby.firebaseapp.com",
    projectId: "share-hobby",
    storageBucket: "share-hobby.appspot.com",
    messagingSenderId: "1083173831933",
    appId: "1:1083173831933:web:6744d8e67654ee11fbea94",
    measurementId: "G-JYDGX9QT0C"
  }
}


/**
 *
 * // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaAXSnxiCu-sdNVZ0QIc2ldWTrINNLllQ",
  authDomain: "share-hobby.firebaseapp.com",
  projectId: "share-hobby",
  storageBucket: "share-hobby.appspot.com",
  messagingSenderId: "1083173831933",
  appId: "1:1083173831933:web:6744d8e67654ee11fbea94",
  measurementId: "G-JYDGX9QT0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



ou can deploy now or later. To deploy now, open a terminal window, then navigate to or create a root directory for your web app.

Sign in to Google
firebase login
Initiate your project
Run this command from your app’s root directory:

firebase init
Specify your site in firebase.json
Add your site ID to the firebase.json configuration file. After you get set up, see the best practices for multi-site deployment.

{
  "hosting": {
    "site": "sharing-it-now",

    "public": "public",
    ...
  }
}
When you’re ready, deploy your web app
Put your static files (e.g., HTML, CSS, JS) in your app’s deploy directory (the default is “public”). Then, run this command from your app’s root directory:

firebase deploy --only hosting:sharing-it-now
After deploying, view your app at sharing-it-now.web.app

Need help? Check out the Hosting docs


 */