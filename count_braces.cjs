const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const returnBlock = code.substring(code.lastIndexOf('  return ('));

let openBraceCount = (returnBlock.match(/\{/g) || []).length;
let closeBraceCount = (returnBlock.match(/\}/g) || []).length;

console.log('brace', openBraceCount, closeBraceCount);

