const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'if (currentProject && currentProject.bookFlowData) {',
  'if (currentProject) {'
);

fs.writeFileSync('src/App.tsx', code);
