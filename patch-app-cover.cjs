const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<CoverPage value={currentProject.bookFlowData?.coverBook} onChange={()=>{}} />',
  '<CoverPage value={currentProject.bookFlowData?.coverBook} onChange={()=>{}} isExport />'
);

fs.writeFileSync('src/App.tsx', code);
