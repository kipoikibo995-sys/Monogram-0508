const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '  };\n    <div \n      className="h-[100dvh] w-full overflow-hidden bg-neutral-50 flex flex-col font-sans text-neutral-900"',
  '  };\n\n  return (\n    <div \n      className="h-[100dvh] w-full overflow-hidden bg-neutral-50 flex flex-col font-sans text-neutral-900"'
);

fs.writeFileSync('src/App.tsx', code);
