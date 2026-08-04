const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

code = code.replace(
  /\{\/\* Solutions section \*\/\}\s*\{!isExportingSolutions && \{processedImages\.map/g,
  "{/* Solutions section */}\n      {!isExportingSolutions && processedImages.map"
);
code = code.replace(
  /                  \}\)\}\s*\}\s*\{\!isExportingSolutions/g,
  "                  })}\n      {!isExportingSolutions"
);

fs.writeFileSync('src/PdfExport.tsx', code);
