const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

code = code.replace(/Pro\/Ent Tier/g, "Paid Tier");

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log("Fixed AdminView text");
