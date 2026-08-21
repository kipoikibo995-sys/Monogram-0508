const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldLogic = `      if (!buyerEmail) {
        console.log("No buyer email provided in IPN data. This is expected during WarriorPlus testing.");
        return res.status(200).send("IPN Processed (Test/Empty)");
      }`;

const newLogic = `      if (!buyerEmail) {
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
      }`;
code = code.replace(oldLogic, newLogic);

fs.writeFileSync('server.ts', code);
