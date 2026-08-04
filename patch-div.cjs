const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<\/div>\s*\) : view === 'bookflow' && currentProject \? \(/;
const replace = `            </div>\n          </div>\n        ) : view === 'bookflow' && currentProject ? (`;

code = code.replace(regex, replace);
fs.writeFileSync('src/App.tsx', code);
