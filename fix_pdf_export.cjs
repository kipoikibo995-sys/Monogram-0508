const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// The duplicate `{userTier === 'pro' && (`
code = code.replace(/{userTier === 'pro' && \(\n\s*{userTier === 'pro' && \(/g, "{userTier === 'pro' && (");

fs.writeFileSync('src/PdfExport.tsx', code);
console.log("Fixed PdfExport");
