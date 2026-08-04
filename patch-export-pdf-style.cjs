const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'id="pdf-export-container" className="fixed top-0 left-[-9999px] flex flex-col gap-4 pointer-events-none"',
  'id="pdf-export-container" className="fixed top-0 left-0 z-[-50] opacity-[0.01] pointer-events-none w-[850px] overflow-hidden"'
);

fs.writeFileSync('src/App.tsx', code);
