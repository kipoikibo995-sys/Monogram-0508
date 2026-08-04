const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'id="pdf-export-container" className="fixed top-[-9999px] left-[-9999px] flex flex-col gap-4 pointer-events-none"',
  'id="pdf-export-container" className="fixed top-0 left-[-9999px] flex flex-col gap-4 pointer-events-none"'
);

fs.writeFileSync('src/App.tsx', code);
