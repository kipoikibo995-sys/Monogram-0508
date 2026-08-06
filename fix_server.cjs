const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The issue was my replacement code replaced 'enterprise' with 'pro' across the whole file in an earlier step, and then I replaced something else, and it matched recursively or I had sed replace it.
// Let's just fix the specific lines by replacing the whole `app.post('/api/user/check-paid', ...)`

code = code.replace(/app\.post\('\/api\/user\/check-paid', async \(req, res\) => \{[\s\S]*?res\.status\(200\)\.json\(\{ isPaid: false \}\);\n    \} catch \(err\) \{[\s\S]*?\}\n  \}\);/g, `app.post('/api/user/check-paid', async (req, res) => {
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
  });`);

fs.writeFileSync('server.ts', code);
console.log("Fixed server.ts block");
