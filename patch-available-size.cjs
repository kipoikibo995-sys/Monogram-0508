const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const availableWidth = window\.innerWidth - 352;/g, "const availableWidth = window.innerWidth - 288;");
code = code.replace(/const availableHeight = window\.innerHeight - 224;/g, "const availableHeight = window.innerHeight - 128;");

fs.writeFileSync('src/App.tsx', code);
