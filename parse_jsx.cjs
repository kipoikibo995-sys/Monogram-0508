const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const returnBlock = code.substring(code.lastIndexOf('  return ('));
console.log(returnBlock.substring(0, 100));
console.log("...");
console.log(returnBlock.substring(returnBlock.length - 200));

let divCount = (returnBlock.match(/<div/g) || []).length;
let divCloseCount = (returnBlock.match(/<\/div>/g) || []).length;

console.log('div', divCount, divCloseCount);
