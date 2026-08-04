const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const returnBlock = code.substring(code.lastIndexOf('  return ('));

let stack = [];
for (let i = 0; i < returnBlock.length; i++) {
  if (returnBlock[i] === '{') stack.push(i);
  else if (returnBlock[i] === '}') {
    if (stack.length === 0) {
      console.log('Extra } at', i, returnBlock.substring(i - 50, i + 10));
      // wait, since we expect 1 extra }, it will be the one that pops when stack is empty!
    } else {
      stack.pop();
    }
  }
}
