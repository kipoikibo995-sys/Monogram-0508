const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

code = code.replace(/<option value="pro">Pro<\/option>\s*<option value="pro">Pro<\/option><option value="regular">Regular<\/option>/, '<option value="regular">Regular</option><option value="pro">Pro</option>');

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log("Fixed AdminView");
