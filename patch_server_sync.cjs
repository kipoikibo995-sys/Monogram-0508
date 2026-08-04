const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const syncEndpoint = `
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
`;

code = code.replace(
  /\/\/ Vite middleware for development/,
  syncEndpoint + '\n  // Vite middleware for development'
);

fs.writeFileSync('server.ts', code);
console.log("Patched sync endpoint");
