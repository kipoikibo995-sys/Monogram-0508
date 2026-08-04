const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

const puzzleLoop = code.match(/\{processedImages\.map\(\(img, i\) => \{[\s\S]*?\}\)\}/)[0];

const solutionsLoop = puzzleLoop.replace(
  /if \(isExportingSolutions \|\| settings\.viewMode === 'solution'\) \{/g,
  "if (true) {"
);

code = code.replace(
  /\{processedImages\.map\(\(img, i\) => \{[\s\S]*?\}\)\}/,
  `${puzzleLoop}\n\n      {/* Solutions section */}\n      {!isExportingSolutions && ${solutionsLoop}}`
);

fs.writeFileSync('src/PdfExport.tsx', code);
