const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
const beforeReturn = code.substring(0, code.lastIndexOf('  return ('));

let stack = [];
for (let i = 0; i < beforeReturn.length; i++) {
  if (beforeReturn[i] === '{') stack.push(i);
  else if (beforeReturn[i] === '}') {
    if (stack.length === 0) {
      console.log('Extra } at', i, beforeReturn.substring(i - 40, i + 10));
    } else {
      stack.pop();
    }
  }
}
console.log('remaining open before return:', stack.length);
