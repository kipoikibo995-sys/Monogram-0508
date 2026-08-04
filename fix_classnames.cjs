const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(/<textarea className="overflow-hidden"/g, '<textarea');
code = code.replace(/<textarea/g, '<textarea className="overflow-hidden"');
code = code.replace(/className="overflow-hidden"[\s\n]*className="/g, 'className="overflow-hidden ');

fs.writeFileSync('src/BookFlow.tsx', code);
