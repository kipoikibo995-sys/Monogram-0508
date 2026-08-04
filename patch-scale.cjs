const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /transform: scale\(0\.95\);/g,
  "transform: scale(${activeSettings.trimSize ? (parseFloat(activeSettings.trimSize.split('x')[0]) * 96 / 850).toFixed(4) : 0.96});"
);

fs.writeFileSync('src/App.tsx', code);
