const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'const db = getApps().length ? getFirestore(databaseId || fallbackDbId) : null;',
  'const db = getApps().length ? getFirestore(databaseId || fallbackDbId) : null;\nif (db) {\n  try {\n    db.settings({ preferRest: true, ignoreUndefinedProperties: true });\n  } catch(e){}\n}'
);

fs.writeFileSync('server.ts', code);
