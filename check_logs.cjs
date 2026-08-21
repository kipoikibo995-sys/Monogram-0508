const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();
const fs = require('fs');

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (process.env.FIREBASE_PROJECT_ID && privateKey && privateKey.includes('BEGIN PRIVATE KEY')) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
    }),
  });
}

const cfg = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const db = getFirestore(cfg.databaseId || cfg.firestoreDatabaseId);

async function check() {
  const logs = await db.collection('ipn_logs').orderBy('timestamp', 'desc').limit(5).get();
  console.log(`Total IPN logs found: ${logs.size}`);
  logs.forEach(d => console.log('Log data:', JSON.stringify(d.data(), null, 2)));
  process.exit(0);
}
check();
