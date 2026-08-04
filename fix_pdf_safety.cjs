const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

code = code.replace(/const maxW = pageW - marginX \* 2;/g, 'const maxW = pageW - marginX * 2 - 10; // safety buffer');
code = code.replace(/const maxH = pageH - marginY \* 2;/g, 'const maxH = pageH - marginY * 2 - 10; // safety buffer');

fs.writeFileSync('src/PdfExport.tsx', code);
