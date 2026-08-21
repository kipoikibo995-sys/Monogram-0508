import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey ? privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n') : '',
  }),
});
const db = getFirestore("ai-studio-remixremixmonogr-ef7cfc64-7239-42ec-967d-7eaddd196266");
try {
  db.settings({ preferRest: true });
  console.log("Settings applied successfully!");
} catch (e) {
  console.error("Settings failed:", e);
}
