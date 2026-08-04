const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<Accordion title="Density Key" defaultOpen=\{false\}>[\s\S]*?<\/Accordion>/;
code = code.replace(regex, '');

fs.writeFileSync('src/App.tsx', code);
