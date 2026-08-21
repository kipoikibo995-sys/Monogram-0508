const fs = require('fs');
let code = fs.readFileSync('api/index.ts', 'utf8');

// 1. Add preferRest to db init
const dbInitOld = 'const db = getApps().length ? getFirestore() : null;';
const dbInitNew = `
let fallbackDbId = "ai-studio-remixremixmonogr-ef7cfc64-7239-42ec-967d-7eaddd196266";
const db = getApps().length ? getFirestore(fallbackDbId) : null;
if (db) {
  try {
    db.settings({ preferRest: true, ignoreUndefinedProperties: true });
  } catch(e){}
}
`;
code = code.replace(dbInitOld, dbInitNew);

// 2. Fix the WP_SECURITYKEY check and add test/ping handler
const ipnOld = `    const data = req.body;
    console.log("Received WarriorPlus IPN:", data);
    
    const securityKey = process.env.WARRIORPLUS_SECURITY_KEY;
    
    // Verify Security Key
    if (securityKey && data.WP_SECURITYKEY !== securityKey) {
      console.error("Invalid Security Key");
      return res.status(403).send("Invalid Security Key");
    }`;

const ipnNew = `    const data = req.body;
    console.log("Received WarriorPlus IPN:", data);
    
    // Handle empty ping or test
    if (Object.keys(data).length === 0 || !data.WP_ACTION) {
       return res.status(200).send("Ping OK");
    }
    if (data.WP_ACTION === 'test') {
       return res.status(200).send("Test OK");
    }
    
    const securityKey = process.env.WARRIORPLUS_SECURITY_KEY || process.env.WARRIORPLUS_SECRET;
    
    // Verify Security Key
    if (securityKey && data.WP_SECURITYKEY !== securityKey) {
      console.error("Invalid Security Key. Expected:", securityKey, "Received:", data.WP_SECURITYKEY);
      return res.status(403).send("Invalid Security Key");
    }`;
code = code.replace(ipnOld, ipnNew);

fs.writeFileSync('api/index.ts', code);
