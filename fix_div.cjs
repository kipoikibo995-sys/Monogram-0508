const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (code.endsWith('</div>\n  );\n}')) {
  code = code.replace(/<\/div>\n  \);\n\}$/, '</div>\n    </div>\n  );\n}');
  fs.writeFileSync('src/App.tsx', code);
}
