const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'id="pdf-export-container" style={{ position: "fixed", top: 0, left: 0, zIndex: -50, opacity: 0.01, pointerEvents: "none" }}',
  'id="pdf-export-container" style={{ position: "absolute", left: "-9999px", top: 0 }}'
);

fs.writeFileSync('src/App.tsx', code);
