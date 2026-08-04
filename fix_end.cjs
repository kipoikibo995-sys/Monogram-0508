const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<\/div>\s*<\/div>\s*\);\s*\}\s*$/, '</div>\n  );\n}\n');
fs.writeFileSync('src/App.tsx', code);
