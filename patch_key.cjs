const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {",
  `const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (process.env.FIREBASE_PROJECT_ID && privateKey && privateKey.includes('BEGIN PRIVATE KEY')) {`
);

code = code.replace(
  "privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\\\n/g, '\\n'),",
  "privateKey: privateKey.replace(/\\\\n/g, '\\n'),"
);

fs.writeFileSync('server.ts', code);
