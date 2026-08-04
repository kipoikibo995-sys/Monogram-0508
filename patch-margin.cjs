const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /style=\{\{\s*padding:\s*"36px"\s*\}\}/g,
  "style={{ padding: (activeSettings.pageMargin || 36) + 'px' }}"
);

fs.writeFileSync('src/App.tsx', code);
