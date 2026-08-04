const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'id="pdf-export-container" className="fixed top-0 left-0 z-[-50] opacity-[0.01] pointer-events-none w-[850px] overflow-hidden"',
  'id="pdf-export-container" style={{ position: "fixed", top: 0, left: 0, zIndex: -50, opacity: 0.01, pointerEvents: "none" }}'
);

fs.writeFileSync('src/App.tsx', code);
