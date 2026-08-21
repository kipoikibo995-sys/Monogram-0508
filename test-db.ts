import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey ? privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n') : '',
  }),
});
const db = getFirestore("ai-studio-remixremixmonogr-ef7cfc64-7239-42ec-967d-7eaddd196266");
db.settings({ preferRest: true });
db.collection('users').get().then(snap => console.log('users count', snap.size)).catch(e => console.error(e));
