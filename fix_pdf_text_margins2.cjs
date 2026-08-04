const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Revert the styles modification
code = code.replace(/paddingHorizontal: pagePadding, /g, '');

// Now inject pagePadding dynamically to the Page components themselves
code = code.replace(/<Page size=\{PAGE_SIZE as any\} style=\{styles\.paddedPage\}>/g, '<Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding}}>');
code = code.replace(/<Page size=\{PAGE_SIZE as any\} style=\{\{ \.\.\.styles\.centerPage, (.*?)\}\}>/g, '<Page size={PAGE_SIZE as any} style={{ ...styles.centerPage, $1, paddingHorizontal: pagePadding }}>');
code = code.replace(/<Page size=\{PAGE_SIZE as any\} style=\{\{ \.\.\.styles\.paddedPage, (.*?)\}\}>/g, '<Page size={PAGE_SIZE as any} style={{ ...styles.paddedPage, $1, paddingHorizontal: pagePadding }}>');

fs.writeFileSync('src/PdfExport.tsx', code);
