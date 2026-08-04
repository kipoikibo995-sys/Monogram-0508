const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

code = code.replace(/width: (\d+)/g, (match, p1) => `width: ${p1} * sf`);
code = code.replace(/height: (\d+)/g, (match, p1) => `height: ${p1} * sf`);
code = code.replace(/width: '100% \* sf'/g, "width: '100%'");
code = code.replace(/width: '90% \* sf'/g, "width: '90%'");
code = code.replace(/width: '45% \* sf'/g, "width: '45%'");
code = code.replace(/width: '80% \* sf'/g, "width: '80%'");
code = code.replace(/height: '100% \* sf'/g, "height: '100%'");
code = code.replace(/width: '18% \* sf'/g, "width: '18%'");
code = code.replace(/maxWidth: (\d+)/g, (match, p1) => `maxWidth: ${p1} * sf`);
code = code.replace(/paddingBottom: (\d+)/g, (match, p1) => `paddingBottom: ${p1} * sf`);
code = code.replace(/paddingLeft: (\d+)/g, (match, p1) => `paddingLeft: ${p1} * sf`);
code = code.replace(/marginRight: (\d+)/g, (match, p1) => `marginRight: ${p1} * sf`);
code = code.replace(/gap: (\d+)/g, (match, p1) => `gap: ${p1} * sf`);


fs.writeFileSync('src/PdfExport.tsx', code);
