const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'setIsExporting(false);',
  `setIsExporting(false);
      const exportContainer = document.getElementById('pdf-export-container');
      if (exportContainer) {
         exportContainer.style.position = 'absolute';
         exportContainer.style.left = '-9999px';
         exportContainer.style.top = '0px';
      }`
);

fs.writeFileSync('src/App.tsx', code);
