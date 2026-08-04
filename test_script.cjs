const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
const regex = /useEffect\(\(\) => \{\n    if \(images.length === 0\) return;\n    const timeoutId = setTimeout\(scheduleRender, 150\);/g;
console.log(code.match(regex));
