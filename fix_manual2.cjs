const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

code = code.replace(/                  \}\)\}\}/g, "                  })}")

fs.writeFileSync('src/PdfExport.tsx', code);
