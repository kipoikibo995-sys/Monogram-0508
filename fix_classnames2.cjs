const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(/<textarea className="overflow-hidden"/g, '<textarea');
code = code.replace(/ className="overflow-hidden /g, ' className="');
code = code.replace(/className="/g, 'className="overflow-hidden ');
// Wait, I only want to add it to textarea!
fs.writeFileSync('src/BookFlow.tsx', code);
