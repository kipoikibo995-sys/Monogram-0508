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
    const targetEmail = "kangjijae@gmail.com";
    
    console.log("--- USER DOC ---");
    const users = await db.collection('users').where('email', '==', targetEmail).get();
    if (users.empty) {
        console.log("No user found with email:", targetEmail);
    }
    users.forEach(d => console.log(d.id, "Tier:", d.data().tier, "Purchases:", JSON.stringify(d.data().purchases)));
    
    console.log("--- RAW IPN LOGS (debug_ipns) ---");
    const debugLogs = await db.collection('debug_ipns').orderBy('date', 'desc').limit(5).get();
    debugLogs.forEach(d => console.log(d.id, JSON.stringify(d.data())));
    
    console.log("--- IPN LOGS (ipn_logs) ---");
    const ipnLogs = await db.collection('ipn_logs').orderBy('timestamp', 'desc').limit(5).get();
    ipnLogs.forEach(d => {
       const data = d.data();
       console.log(d.id, "Buyer:", data.body?.WP_BUYER_EMAIL, "Item:", data.body?.WP_ITEM_NUMBER, "Action:", data.body?.WP_ACTION);
    });

    console.log("--- PENDING UPGRADES ---");
    const pending = await db.collection('pending_upgrades').where('email', '==', targetEmail).get();
    if (pending.empty) console.log("No pending upgrades for", targetEmail);
    pending.forEach(d => console.log(d.id, JSON.stringify(d.data())));
}
check().then(() => process.exit(0)).catch(console.error);
