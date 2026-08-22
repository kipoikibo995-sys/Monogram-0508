const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// For mystery: ends at `</Page>` right before the warmup {userTier === 'pro' && (
code = code.replace(/<\/Page>\n\s*\{userTier === 'pro' && \(\n\s*<Page size=\{PAGE_SIZE as any\} style=\{\{\.\.\.styles\.paddedPage, paddingHorizontal: pagePadding \* sf\}\}>\n\s*<Text style=\{\{ fontSize: 24 \* sf, fontFamily: 'Helvetica-Bold'/g, 
`</Page>\n          )}\n\n          {userTier === 'pro' && (\n          <Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>\n            <Text style={{ fontSize: 24 * sf, fontFamily: 'Helvetica-Bold'`);

// For warmup: ends at `</Page>` right before the pentesting {userTier === 'pro' && (
code = code.replace(/<\/Page>\n\s*\{userTier === 'pro' && \(\n\s*<Page size=\{PAGE_SIZE as any\} style=\{\{\.\.\.styles\.paddedPage, paddingHorizontal: pagePadding \* sf\}\}>\n\s*<Text style=\{\{ fontSize: 28 \* sf, fontFamily: 'Helvetica-Bold'/g, 
`</Page>\n          )}\n\n          {userTier === 'pro' && (\n          <Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>\n            <Text style={{ fontSize: 28 * sf, fontFamily: 'Helvetica-Bold'`);

// For pentesting: ends at `</Page>` right before `</>`
code = code.replace(/<\/Page>\n\s*<\/>\n\s*\)}/g, 
`</Page>\n          )}\n        </>\n      )}`);

fs.writeFileSync('src/PdfExport.tsx', code);
console.log("Fixed PdfExport tags");
