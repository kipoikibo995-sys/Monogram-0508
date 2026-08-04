const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /transform:\s*scale\([^)]+\)/g;
code = code.replace(regex, "transform: `scale(${activeSettings.trimSize ? (parseFloat(activeSettings.trimSize.split('x')[0]) * 96 / 850) : 0.96})`");

// Wait, the style block is a template literal string inside JSX `{...}`.
// The regex might not work properly if I replace it inside the style block string.
// Let's just do a specific string replace inside the style block.
