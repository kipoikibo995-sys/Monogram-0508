const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "const html2canvasModule = await import('html2canvas');",
  "const htmlToImage = await import('html-to-image');"
);
code = code.replace(
  "const html2canvas = html2canvasModule.default;",
  ""
);
code = code.replace(
  "const canvas = await html2canvas(el, { scale: 2, useCORS: true, allowTaint: true });",
  "const canvas = await htmlToImage.toCanvas(el, { pixelRatio: 2 });"
);
fs.writeFileSync('src/App.tsx', code);
