const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('  };  };\n\n  return (', '  };\n\n  return (');
fs.writeFileSync('src/App.tsx', code);
