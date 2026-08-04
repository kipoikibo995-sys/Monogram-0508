const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `const doc = <PdfDocument project={currentProject!} processedImages={processedImages} isExportingSolutions={exportType} />;`,
  `const doc = <PdfDocument project={currentProject!} processedImages={processedImages} isExportingSolutions={exportType} userTier={userTier} />;`
);

fs.writeFileSync('src/App.tsx', code);
