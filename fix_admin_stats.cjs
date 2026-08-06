const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

code = code.replace(/u\.tier === 'pro' \|\| u\.tier === 'pro'/g, "u.tier === 'regular' || u.tier === 'pro'");

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log("Fixed AdminView stats");
