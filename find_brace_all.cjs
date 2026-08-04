const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

let stack = [];
for (let i = 0; i < code.length; i++) {
  if (code[i] === '{') stack.push(i);
  else if (code[i] === '}') {
    if (stack.length === 0) {
      console.log('Extra } at', i, code.substring(i - 40, i + 10));
    } else {
      stack.pop();
    }
  }
}
console.log('remaining open', stack.length);
