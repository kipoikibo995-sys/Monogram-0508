const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

code = code.replace(/const pageW = settings\.trimSize === '8\.5x11' \? 850 : settings\.trimSize === '6x9' \? 600 : 850;/g, 
  "const pageW = settings.trimSize === '8.5x11' ? 612 : settings.trimSize === '6x9' ? 432 : 612;");

code = code.replace(/const pageH = settings\.trimSize === '8\.5x11' \? 1100 : settings\.trimSize === '6x9' \? 900 : 850;/g,
  "const pageH = settings.trimSize === '8.5x11' ? 792 : settings.trimSize === '6x9' ? 648 : 612;");

// Fix the margin calculation to use KDP safe margins (36 points = 0.5") + gutter
const oldMaxW = `const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;`;

const newMaxW = `const baseMargin = 36;
        const gutter = settings.gutterMargin || 0;
        const marginX = baseMargin + gutter;
        const marginY = baseMargin;
        const maxW = pageW - marginX * 2;
        const maxH = pageH - marginY * 2;`;

code = code.replace(new RegExp(oldMaxW.replace(/[.*+?^$\{key\}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newMaxW);

fs.writeFileSync('src/PdfExport.tsx', code);
