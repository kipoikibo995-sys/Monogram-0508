const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

code = code.replace(
  /<View style=\{\{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 30 \}\}>\s*<PdfImage src=\{cover\.templateImage\} style=\{\{ width: '85%', height: '100%', objectFit: 'contain' \}\} \/>\s*<\/View>/,
  `<View style={{ flexGrow: 1, width: '100%', alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
                 <PdfImage src={cover.templateImage} style={{ width: '90%', height: 450, objectFit: 'contain' }} />
               </View>`
);

fs.writeFileSync('src/PdfExport.tsx', code);
