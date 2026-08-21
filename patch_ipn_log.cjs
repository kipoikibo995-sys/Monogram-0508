const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace the console.log with a firestore insert so we can see the raw request!
const replaceStr = `
      const data = req.body;
      const logEntry = \`\\n[\${new Date().toISOString()}] IPN Received:\\nHeaders: \${JSON.stringify(req.headers)}\\nBody: \${JSON.stringify(data)}\\n\`;
      fs.appendFileSync('ipn_debug.log', logEntry);
      
      console.log("Received WarriorPlus IPN:", data);
`;

const newStr = `
      const data = req.body;
      console.log("Received WarriorPlus IPN:", data);
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
`;

code = code.replace(replaceStr, newStr);

fs.writeFileSync('server.ts', code);
