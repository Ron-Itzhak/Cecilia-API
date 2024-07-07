import admin from "firebase-admin";
import * as serviceAccount from "./firebaseServiceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "books-app-3c41b.appspot.com",
});

const db = admin.firestore();

const bucket = admin.storage().bucket();

export { db, bucket };
