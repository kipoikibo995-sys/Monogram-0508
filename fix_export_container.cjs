const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "exportContainer.style.position = 'absolute';\n           exportContainer.style.left = '-9999px';",
  "exportContainer.style.position = 'fixed';\n           exportContainer.style.left = '0px';\n           exportContainer.style.top = '0px';\n           exportContainer.style.zIndex = '-9999';"
);

fs.writeFileSync('src/App.tsx', code);
