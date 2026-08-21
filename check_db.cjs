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
const db = getFirestore(cfg.firestoreDatabaseId);

async function check() {
  const email = 'kipoikibo995@gmail.com';
  console.log(`Checking DB for ${email}...`);
  
  const users = await db.collection('users').where('email', '==', email).get();
  console.log(`User found: ${users.size}`);
  users.forEach(d => console.log('User data:', d.data()));

  const pending = await db.collection('pending_upgrades').where('email', '==', email).get();
  console.log(`Pending upgrades found: ${pending.size}`);
  pending.forEach(d => console.log('Pending data:', d.data()));
  
  process.exit(0);
}
check();
