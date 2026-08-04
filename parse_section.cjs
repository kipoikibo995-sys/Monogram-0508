const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const sectionStart = code.indexOf('<section');
const mainEnd = code.indexOf('</main>');
const sectionContent = code.substring(sectionStart, mainEnd);

console.log('section content tail:');
console.log(sectionContent.substring(sectionContent.length - 300));
