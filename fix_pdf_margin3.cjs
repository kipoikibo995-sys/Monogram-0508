const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

code = code.replace(/const maxW = pageW - margin \* 2;\s*const maxH = pageH - margin \* 2;/g,
  `const baseMargin = 36;
        const gutter = settings.gutterMargin || 0;
        const marginX = baseMargin + gutter;
        const marginY = baseMargin;
        const maxW = pageW - marginX * 2;
        const maxH = pageH - marginY * 2;`);

fs.writeFileSync('src/PdfExport.tsx', code);
