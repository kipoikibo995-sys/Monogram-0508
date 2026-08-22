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

async function createReviewer() {
    const email = "kojiacademy2026@gmail.com";
    const password = "happyforyou";
    let uid;
    
    try {
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            emailVerified: true,
        });
        uid = userRecord.uid;
        console.log("Successfully created new user:", userRecord.uid);
    } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
            console.log("User already exists. Updating password...");
            const userRecord = await auth.getUserByEmail(email);
            uid = userRecord.uid;
            await auth.updateUser(uid, { password: password });
            console.log("Password updated successfully.");
        } else {
            throw error;
        }
    }

    // Add to users collection as Pro
    await db.collection('users').doc(uid).set({
        email: email,
        tier: 'pro',
        role: 'admin',
        createdAt: Date.now(),
        purchases: [{ item: 'Reviewer Access', date: Date.now(), txId: 'review' }]
    }, { merge: true });
    
    console.log("Firestore updated. User is now Pro.");
}

createReviewer().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
