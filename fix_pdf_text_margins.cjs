const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Replace all instances of style={styles.centerPage} or style={{ ...styles.centerPage... }}
// We can just define a constant at the top of PdfDocument:
// const pagePadding = Math.max(50, 36 + gutter);
// And then replace padding: 40 and padding: 50 with paddingHorizontal: pagePadding

code = code.replace(/const safeMargin = 36;\n  const gutter = processedImages\[0\]\?.settings\?.gutterMargin \|\| 0;/g, 
  `const safeMargin = 36;
  const gutter = processedImages[0]?.settings?.gutterMargin || 0;
  const pagePadding = Math.max(50, safeMargin + gutter + 10); // add 10pt buffer
`);

code = code.replace(/padding: 40/g, 'padding: 40, paddingHorizontal: pagePadding');
code = code.replace(/padding: 50/g, 'padding: 50, paddingHorizontal: pagePadding');

fs.writeFileSync('src/PdfExport.tsx', code);
