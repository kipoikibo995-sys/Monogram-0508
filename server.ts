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
        privateKey: privateKey.replace(/\\n/g, '\n'),
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

const db = getApps().length ? getFirestore() : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  
  // Use express.urlencoded for IPN (WarriorPlus sends form data)
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // IPN Endpoint
  app.post('/api/ipn/warriorplus', async (req, res) => {
    try {
      const data = req.body;
      console.log("Received WarriorPlus IPN:", data);

      const securityKey = process.env.WARRIORPLUS_SECURITY_KEY;
      
      // Verify Security Key
      if (securityKey && data.WP_SECURITYKEY !== securityKey) {
        console.error("Invalid Security Key");
        return res.status(403).send("Invalid Security Key");
      }

      if (!db) {
        console.error("Firestore not initialized.");
        return res.status(500).send("Server Database Error");
      }

      const action = data.WP_ACTION;
      const buyerEmail = data.WP_BUYER_EMAIL?.toLowerCase();
      const itemName = data.WP_ITEM_NAME;
      const customData = data.WP_CUSTOM; // If you pass UID via affiliate link

      if (!buyerEmail) {
        return res.status(400).send("No buyer email provided.");
      }

      // Look up user by email
      const usersRef = db.collection('users');
      const q = usersRef.where('email', '==', buyerEmail).limit(1);
      const snapshot = await q.get();

      if (snapshot.empty) {
         console.warn(`No user found with email ${buyerEmail}. They might need to create an account first.`);
         // Optionally, you could create a placeholder user here
         return res.status(200).send("User not found, but IPN received.");
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;

      if (action === 'sale') {
        // Update user tier and add purchase
        let newTier = 'pro';
        // Map item names or numbers to specific tiers
        const itemNameLower = itemName ? itemName.toLowerCase() : '';
        if (itemNameLower.includes('enterprise') || itemNameLower.includes('oto')) {
          newTier = 'enterprise';
        }
        
        await userDoc.ref.update({
          tier: newTier,
          purchases: FieldValue.arrayUnion({
            item: itemName,
            date: Date.now(),
            txId: data.WP_TXNID || 'unknown'
          })
        });
        
        console.log(`Successfully upgraded user ${userId} to ${newTier}`);
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
      
      let newTier = currentTier;

      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.action === 'sale') {
           const itemNameLower = data.itemName ? data.itemName.toLowerCase() : '';
           let upgradeTo = 'pro';
           if (itemNameLower.includes('enterprise') || itemNameLower.includes('oto')) {
             upgradeTo = 'enterprise';
           }
           
           if (upgradeTo === 'enterprise') newTier = 'enterprise';
           else if (upgradeTo === 'pro' && newTier === 'free') newTier = 'pro';

           purchases.push({
             item: data.itemName,
             date: data.date,
             txId: data.txId
           });
        } else if (data.action === 'refund') {
           newTier = 'free';
        }
        await doc.ref.delete(); // Remove the pending upgrade
      }

      await userDoc.ref.update({
         tier: newTier,
         purchases: purchases
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
