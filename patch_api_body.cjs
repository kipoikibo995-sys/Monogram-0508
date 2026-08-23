const fs = require('fs');
let content = fs.readFileSync('api/index.ts', 'utf8');

// Replace the debug IPN log to include headers and raw body if possible
content = content.replace(
  "if (db) { await db.collection('debug_ipns').add({ date: Date.now(), data: req.body }); }",
  "if (db) { await db.collection('debug_ipns').add({ date: Date.now(), data: req.body, headers: req.headers, rawData: typeof req.body }); }"
);

fs.writeFileSync('api/index.ts', content);
