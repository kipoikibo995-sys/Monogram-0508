const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'id="pdf-export-container" style={{ position: "absolute", left: "-9999px", top: 0 }}',
  'id="pdf-export-container" style={{ position: "fixed", left: 0, top: 0, zIndex: -9999, opacity: 0, pointerEvents: "none" }}'
);

fs.writeFileSync('src/App.tsx', code);
