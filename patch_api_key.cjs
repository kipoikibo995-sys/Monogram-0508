const fs = require('fs');
let content = fs.readFileSync('api/index.ts', 'utf8');

content = content.replace(/privateKey\.replace\(\/\\\\n\/g, '\\n'\)/g, "privateKey.replace(/^\"|\"$/g, '').replace(/\\\\n/g, '\\n')");

fs.writeFileSync('api/index.ts', content);
