const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "const canvas = await htmlToImage.toCanvas(el, { pixelRatio: 2 });",
  "const canvas = await htmlToImage.toCanvas(el, { pixelRatio: 2 });\n            // add dummy line"
);
fs.writeFileSync('src/App.tsx', code);
