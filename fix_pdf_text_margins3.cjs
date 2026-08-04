const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Remove duplicate paddingHorizontal
code = code.replace(/paddingHorizontal: pagePadding , paddingHorizontal: pagePadding/g, 'paddingHorizontal: pagePadding');
code = code.replace(/paddingHorizontal: pagePadding, paddingHorizontal: pagePadding/g, 'paddingHorizontal: pagePadding');

fs.writeFileSync('src/PdfExport.tsx', code);
