/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


export const createUserRecord = functions.auth.user().onCreate((user) => {
  const userRef = admin.firestore().collection('subscribers').doc(user.uid);
  return userRef.set({
    userRef: userRef,
    userId: user.uid,
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
