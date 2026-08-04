const fs = require('fs');
const sm = JSON.parse(fs.readFileSync('/tmp/sourcemap.json', 'utf8'));
fs.writeFileSync('/tmp/original_App.tsx', sm.sourcesContent[0]);
