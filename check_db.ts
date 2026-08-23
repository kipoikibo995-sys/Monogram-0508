import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey ? privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n') : '',
      }),
    });
}
const fallbackDbId = "ai-studio-remixremixmonogr-ef7cfc64-7239-42ec-967d-7eaddd196266";
const db = getFirestore(fallbackDbId);

async function check() {
    console.log("--- PROCESSED IPNS ---");
    const ipns = await db.collection('processed_ipns').orderBy('date', 'desc').limit(5).get();
    ipns.forEach(d => console.log(d.id, d.data()));

    console.log("\n--- PENDING UPGRADES ---");
    const pending = await db.collection('pending_upgrades').orderBy('date', 'desc').limit(5).get();
    pending.forEach(d => console.log(d.id, d.data()));

    console.log("\n--- USERS ---");
    const users = await db.collection('users').limit(5).get();
    users.forEach(d => console.log(d.id, d.data().email, d.data().tier, d.data().purchases?.length));
}
check().then(() => process.exit(0)).catch(console.error);
