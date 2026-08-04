const fs = require('fs');
let code = fs.readFileSync('src/db.ts', 'utf8');

code = code.replace(
  "mystery?: string;",
  "mystery?: string;\n  thankyou?: string;"
);

fs.writeFileSync('src/db.ts', code);
