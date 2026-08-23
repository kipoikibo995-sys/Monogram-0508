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
    const targetEmail = "cagolale@gmail.com";
    
    console.log("--- ipn_logs ---");
    const ipnLogs = await db.collection('ipn_logs').orderBy('timestamp', 'desc').limit(20).get();
    ipnLogs.forEach(d => {
       const data = d.data();
       if (data.body && data.body.WP_BUYER_EMAIL === targetEmail) {
           console.log("FOUND IN ipn_logs:", d.id, JSON.stringify(data.body));
       }
    });

    console.log("--- pending_upgrades ---");
    const pending = await db.collection('pending_upgrades').where('email', '==', targetEmail).get();
    pending.forEach(d => console.log(d.id, d.data()));

    console.log("--- processed_ipns ---");
    const processed = await db.collection('processed_ipns').where('email', '==', targetEmail).get();
    processed.forEach(d => console.log(d.id, d.data()));

    console.log("--- USERS ---");
    const users = await db.collection('users').where('email', '==', targetEmail).get();
    users.forEach(d => console.log(d.id, d.data()));
    
    console.log("--- All recent IPN logs (just emails) ---");
    ipnLogs.forEach(d => {
       const data = d.data();
       console.log(d.id, data.body?.WP_BUYER_EMAIL, data.body?.WP_ACTION, data.body?.WP_SECURITYKEY ? "has_key" : "no_key");
    });
}
check().then(() => process.exit(0)).catch(console.error);
