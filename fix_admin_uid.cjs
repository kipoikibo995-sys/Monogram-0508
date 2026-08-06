const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

code = code.replace(/data\.push\(doc\.data\(\) as UserData\);/, 'data.push({ ...doc.data(), uid: doc.id } as UserData);');

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log("Fixed AdminView uid");
