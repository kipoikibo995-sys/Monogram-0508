import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
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

const auth = getAuth();
let fallbackDbId = "ai-studio-remixremixmonogr-ef7cfc64-7239-42ec-967d-7eaddd196266";
const db = getFirestore(fallbackDbId);
db.settings({ preferRest: true, ignoreUndefinedProperties: true });

async function downgradeReviewer() {
    const email = "kojiacademy2026@gmail.com";
    const userRecord = await auth.getUserByEmail(email);
    const uid = userRecord.uid;
    
    await db.collection('users').doc(uid).update({
        tier: 'regular'
    });
    
    console.log("User tier updated to regular.");
}

downgradeReviewer().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
