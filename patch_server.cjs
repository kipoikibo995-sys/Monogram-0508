const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /if \(snapshot\.empty\) \{\n\s*console\.warn\(\`No user found with email \$\{buyerEmail\}\. They might need to create an account first\.\`\);\n\s*\/\/ Optionally, you could create a placeholder user here\n\s*return res\.status\(200\)\.send\("User not found, but IPN received\."\);\n\s*\}/,
  `if (snapshot.empty) {
         console.warn(\`No user found with email \${buyerEmail}. Saving to pending upgrades.\`);
         await db.collection('pending_upgrades').add({
           email: buyerEmail,
           action: action,
           itemName: itemName,
           date: Date.now(),
           txId: data.WP_TXNID || 'unknown'
         });
         return res.status(200).send("User not found, saved to pending upgrades.");
      }`
);

// Add API route to check if an email is paid
const apiCode = `
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
        if (userTier === 'pro' || userTier === 'enterprise') {
          return res.status(200).json({ isPaid: true });
        }
      }

      res.status(200).json({ isPaid: false });
    } catch (err) {
      console.error("Check paid error:", err);
      res.status(500).send("Internal error");
    }
  });
`;

code = code.replace(
  /app\.post\('\/api\/user\/sync-upgrades'/,
  apiCode + "\n  app.post('/api/user/sync-upgrades'"
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts for IPN pending upgrades and check API");
