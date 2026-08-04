const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /style={{ width: canvasRefs\.current\[i\] \? [^}]+ }}/g;
code = code.replace(regex, "");

fs.writeFileSync('src/App.tsx', code);
