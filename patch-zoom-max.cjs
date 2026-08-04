const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'onClick={() => setZoom(Math.min(200, zoom + 25))}',
  'onClick={() => setZoom(Math.min(400, zoom + 25))}'
);

fs.writeFileSync('src/App.tsx', code);
