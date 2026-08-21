import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Firebase Admin for server-side operations
// In production, ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY are set
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (process.env.FIREBASE_PROJECT_ID && privateKey && privateKey.includes('BEGIN PRIVATE KEY')) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace literal \n with actual newlines
        privateKey: privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
      }),
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (err) {
    console.error("Firebase Admin initialization error:", err);
  }
} else {
  console.warn("⚠️ Firebase Admin credentials not found. IPN updates will fail.");
  // Initialize without credentials (might work if running in GCP context, but usually needs env vars)
}

import fs from 'fs';

const dbConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
let fallbackDbId = "ai-studio-remixremixmonogr-ef7cfc64-7239-42ec-967d-7eaddd196266";
let databaseId = undefined;
if (fs.existsSync(dbConfigPath)) {
  try {
    const cfg = JSON.parse(fs.readFileSync(dbConfigPath, 'utf8'));
    databaseId = cfg.firestoreDatabaseId || cfg.databaseId || fallbackDbId;
  } catch (e) {}
}

const db = getApps().length ? getFirestore(databaseId || fallbackDbId) : null;
if (db) {
  try {
    db.settings({ preferRest: true, ignoreUndefinedProperties: true });
  } catch(e){}
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(cors());
  
  // Use express.urlencoded for IPN (WarriorPlus sends form data)
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // IPN Endpoint
  app.post('/api/wplus/ipn', async (req, res) => {
    try {
      const data = req.body;
      console.log("Received WarriorPlus IPN:", data);
      
      // Handle empty ping or test
      if (Object.keys(data).length === 0 || !data.WP_ACTION) {
         return res.status(200).send("Ping OK");
      }
      if (data.WP_ACTION === 'test') {
         return res.status(200).send("Test OK");
      }
      try {
        if (db) {
          await db.collection('ipn_logs').add({
            timestamp: Date.now(),
            body: data,
            headers: req.headers
          });
        }
      } catch (e) {
        console.error("Failed to log IPN to db", e);
      }
      
      const securityKey = process.env.WARRIORPLUS_SECURITY_KEY || process.env.WARRIORPLUS_SECRET;
      
      // Verify Security Key
      if (securityKey && data.WP_SECURITYKEY !== securityKey) {
        console.error("Invalid Security Key. Expected:", securityKey, "Received:", data.WP_SECURITYKEY);
        return res.status(403).send("Invalid Security Key");
      }
      
      if (!db) {
        console.error("Firestore not initialized.");
        return res.status(500).send("Server Database Error");
      }
      
      const action = data.WP_ACTION;
      const buyerEmail = data.WP_BUYER_EMAIL?.toLowerCase();
      const itemName = data.WP_ITEM_NAME;
      const itemNumber = data.WP_ITEM_NUMBER; // Add item number for explicit checking
      const customData = data.WP_CUSTOM; // If you pass UID via affiliate link
      
      if (!buyerEmail) {
        console.log("No buyer email provided in IPN data. This is expected during WarriorPlus testing.");
        return res.status(200).send("IPN Processed (Test/Empty)");
      }
      
      const txnId = data.WP_TXNID;
      if (txnId) {
        try {
           const txRef = db.collection('processed_ipns').doc(txnId);
           const txDoc = await txRef.get();
           if (txDoc.exists) {
               console.log("Duplicate IPN - Đã xử lý trước đó:", txnId);
               return res.status(200).send("Duplicate IPN");
           }
           await txRef.set({ email: buyerEmail, itemNumber, date: Date.now() });
        } catch(e) {
           console.error("Error checking idempotency", e);
        }
      }
      
      // Look up user by email
      const usersRef = db.collection('users');
      const q = usersRef.where('email', '==', buyerEmail).limit(1);
      const snapshot = await q.get();
      
      if (snapshot.empty) {
         console.warn(`No user found with email ${buyerEmail}. Saving to pending upgrades.`);
         await db.collection('pending_upgrades').add({
           email: buyerEmail,
           action: action,
           itemName: itemName,
           itemNumber: itemNumber || '',
           date: Date.now(),
           txId: data.WP_TXNID || 'unknown'
         });
         return res.status(200).send("User not found, saved to pending upgrades.");
      }
      
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;
      
      if (action === 'sale') {
        let newTier = userData.tier || 'free';
        
        // 1. Explicit Item Number Checking
        if (itemNumber === 'wso_tbn52k') {
          if (newTier === 'free') newTier = 'regular'; // FE Product
        } else if (itemNumber === 'wso_xj9kp4' || itemNumber === 'wso_fk8qy9') {
          newTier = 'pro'; // PRO Editions
        } else {
          // 2. Fallback: Map item names to specific tiers if no exact itemNumber match
          const itemNameLower = itemName ? itemName.toLowerCase() : '';
          if (itemNameLower.includes('pro') || itemNameLower.includes('oto') || itemNameLower.includes('enterprise')) {
            newTier = 'pro';
          }
        }

        await userDoc.ref.update({
          tier: newTier,
          purchases: FieldValue.arrayUnion({
            itemName: itemName || 'Unknown Item',
            itemNumber: itemNumber || '',
            date: Date.now(),
            txId: data.WP_TXNID || 'unknown'
          }),
          purchased_items: FieldValue.arrayUnion(itemNumber || '')
        });

        console.log(`Successfully upgraded user ${userId} to ${newTier} for item ${itemNumber}`);
      } else if (action === 'refund') {
        // Handle refunds - downgrade tier
        await userDoc.ref.update({
          tier: 'free'
        });
        console.log(`Successfully downgraded user ${userId} due to refund.`);
      }
      
      // Always return 200 to acknowledge receipt to WarriorPlus
      res.status(200).send("IPN Processed");
    } catch (error) {
      console.error("Error processing IPN:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
  app.post('/api/user/check-paid', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !db) return res.status(400).send("Bad request");
      
      const pendingRef = db.collection('pending_upgrades');
      const pendingSnap = await pendingRef.where('email', '==', email.toLowerCase()).where('action', '==', 'sale').get();
      
      if (!pendingSnap.empty) {
        return res.status(200).json({ isPaid: true });
      }
      
      const usersRef = db.collection('users');
      const userSnap = await usersRef.where('email', '==', email.toLowerCase()).limit(1).get();
      
      if (!userSnap.empty) {
        const userTier = userSnap.docs[0].data().tier;
        if (userTier === 'regular' || userTier === 'pro') {
          return res.status(200).json({ isPaid: true });
        }
      }
      res.status(200).json({ isPaid: false });
    } catch (err) {
      console.error("Check paid error:", err);
      res.status(500).send("Internal error");
    }
  });

  app.post('/api/user/sync-upgrades', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !db) return res.status(400).send("Bad request");
      
      const pendingRef = db.collection('pending_upgrades');
      const q = pendingRef.where('email', '==', email.toLowerCase());
      const snapshot = await q.get();
      
      if (snapshot.empty) {
        return res.status(200).json({ status: 'no_pending_upgrades' });
      }
      
      const usersRef = db.collection('users');
      const userQ = usersRef.where('email', '==', email.toLowerCase()).limit(1);
      const userSnap = await userQ.get();
      
      if (userSnap.empty) {
         return res.status(200).json({ status: 'user_not_found_yet' });
      }
      
      const userDoc = userSnap.docs[0];
      let currentTier = userDoc.data().tier || 'free';
      const purchases = userDoc.data().purchases || [];
      const purchasedItems = userDoc.data().purchased_items || [];
      
      let newTier = currentTier;
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.action === 'sale') {
           const itemNumber = data.itemNumber || '';
           
           if (itemNumber === 'wso_tbn52k') {
             if (newTier === 'free') newTier = 'regular'; // FE
           } else if (itemNumber === 'wso_xj9kp4' || itemNumber === 'wso_fk8qy9') {
             newTier = 'pro'; // PRO
           } else {
             // Fallback
             const itemNameLower = data.itemName ? data.itemName.toLowerCase() : '';
             if (itemNameLower.includes('pro') || itemNameLower.includes('oto') || itemNameLower.includes('enterprise')) {
               newTier = 'pro';
             }
           }
           
           purchases.push({
             itemName: data.itemName || 'Unknown Item',
             itemNumber: itemNumber,
             date: data.date,
             txId: data.txId || 'unknown'
           });

           if (itemNumber && !purchasedItems.includes(itemNumber)) {
             purchasedItems.push(itemNumber);
           }
        } else if (data.action === 'refund') {
           newTier = 'free';
        }
        await doc.ref.delete(); // Remove the pending upgrade
      }
      
      await userDoc.ref.update({
         tier: newTier,
         purchases: purchases,
         purchased_items: purchasedItems
      });
      
      res.status(200).json({ status: 'upgraded', tier: newTier });
    } catch (err) {
      console.error("Sync upgrades error:", err);
      res.status(500).send("Internal error");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
