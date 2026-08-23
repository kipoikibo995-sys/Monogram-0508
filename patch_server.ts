import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

// Add debug logging to IPN endpoint
const ipnStart = `app.post('/api/wplus/ipn', async (req, res) => {\n    try {\n      const data = req.body;`;
const ipnDebug = `\n      // DEBUG: log every IPN received\n      if (db) { await db.collection('debug_ipns').add({ date: Date.now(), data: req.body }); }\n`;

code = code.replace(ipnStart, ipnStart + ipnDebug);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts with debug IPN logging");
