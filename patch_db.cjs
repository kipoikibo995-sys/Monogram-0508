const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'const dbConfigPath = path.join(process.cwd(), \'firebase-applet-config.json\');',
  'const dbConfigPath = path.join(process.cwd(), \'firebase-applet-config.json\');\nlet fallbackDbId = "ai-studio-remixremixmonogr-ef7cfc64-7239-42ec-967d-7eaddd196266";'
);

code = code.replace(
  'databaseId = cfg.firestoreDatabaseId;',
  'databaseId = cfg.firestoreDatabaseId || cfg.databaseId || fallbackDbId;'
);

code = code.replace(
  'const db = getApps().length ? getFirestore(databaseId) : null;',
  'const db = getApps().length ? getFirestore(databaseId || fallbackDbId) : null;'
);

fs.writeFileSync('server.ts', code);
