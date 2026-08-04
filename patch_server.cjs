const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
`      if (snapshot.empty) { 
         console.warn(\`No user found with email \${buyerEmail}. They might need to create an account first.\`);
         // Optionally, you could create a placeholder user here
         return res.status(200).send("User not found, but IPN received.");
      }`,
`      if (snapshot.empty) { 
         console.warn(\`No user found with email \${buyerEmail}. They might need to create an account first. Storing in pending_upgrades.\`);
         
         const pendingRef = db.collection('pending_upgrades');
         await pendingRef.add({
            email: buyerEmail,
            action: action,
            itemName: itemName,
            txId: data.WP_TXNID || 'unknown',
            date: Date.now(),
            raw_data: data
         });

         return res.status(200).send("User not found, IPN stored in pending_upgrades.");
      }`
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts with pending_upgrades");
