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
    console.log("--- debug_ipns ---");
    const debugLogs = await db.collection('debug_ipns').orderBy('date', 'desc').limit(2).get();
    debugLogs.forEach(d => console.log(d.id, JSON.stringify(d.data())));
    
    console.log("--- ipn_logs ---");
    const ipnLogs = await db.collection('ipn_logs').orderBy('timestamp', 'desc').limit(2).get();
    ipnLogs.forEach(d => console.log(d.id, JSON.stringify(d.data().body)));
}
check().then(() => process.exit(0)).catch(console.error);
