const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /className="w-\[850px\] h-\[1100px\] bg-white"/g,
  'className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: "40px" }}'
);

fs.writeFileSync('src/App.tsx', code);
