const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// The image max height should be dynamically clamped.
// We can just use a smaller relative height or flex: 1 with minHeight: 0 and NO explicit height.
// Wait, react-pdf might not respect flex: 1 with no height. But it does respect max-height or height in %.
// If we set \`height: PAGE_SIZE[1] * 0.4\` it's 40% of the page height.

code = code.replace(
  /height: 450 \* sf/g,
  "height: PAGE_SIZE[1] * 0.45"
);

fs.writeFileSync('src/PdfExport.tsx', code);
console.log("Fixed height for cover image");
