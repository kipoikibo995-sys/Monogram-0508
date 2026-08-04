const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
const returnBlock = code.substring(code.lastIndexOf('  return ('));

let level = 0;
let output = [];
const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
let match;
while ((match = tagRegex.exec(returnBlock)) !== null) {
  const isClosing = match[0].startsWith('</');
  const isSelfClosing = match[0].replace(/\s+/, '').endsWith('/>') || match[0].match(/\/\s*>$/);
  const tagName = match[1];
  
  if (isClosing) {
    level--;
    output.push('  '.repeat(Math.max(0, level)) + '</' + tagName + '>');
  } else {
    output.push('  '.repeat(Math.max(0, level)) + '<' + tagName + '>');
    if (!isSelfClosing && tagName !== 'img' && tagName !== 'input' && tagName !== 'br' && tagName !== 'hr' && tagName !== 'style') {
      level++;
    }
  }
}
console.log(output.join('\n'));
