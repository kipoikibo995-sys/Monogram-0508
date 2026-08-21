const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldLogic = `      const securityKey = process.env.WARRIORPLUS_SECURITY_KEY;
      
      // Verify Security Key
      if (securityKey && data.WP_SECURITYKEY !== securityKey) {
        console.error("Invalid Security Key");
        return res.status(403).send("Invalid Security Key");
      }`;

const newLogic = `      const securityKey = process.env.WARRIORPLUS_SECURITY_KEY || process.env.WARRIORPLUS_SECRET;
      
      // Verify Security Key
      if (securityKey && data.WP_SECURITYKEY !== securityKey) {
        console.error("Invalid Security Key. Expected:", securityKey, "Received:", data.WP_SECURITYKEY);
        return res.status(403).send("Invalid Security Key");
      }`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('server.ts', code);
