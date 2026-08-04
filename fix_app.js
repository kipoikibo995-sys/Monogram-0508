const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix Slider
code = code.replace(
  /function Slider[\s\S]*?\}\s*\}\)/g, 
  '' // wait this regex is wrong.
);
