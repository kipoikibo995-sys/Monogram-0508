const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const returnBlock = code.substring(code.lastIndexOf('  return ('));
let depth = 0;
for (let i = 0; i < returnBlock.length; i++) {
  if (returnBlock[i] === '{') depth++;
  else if (returnBlock[i] === '}') {
    depth--;
    if (depth < 0) {
      console.log('Extra } at index', i, 'around context:');
      console.log(returnBlock.substring(i - 40, i + 40));
      process.exit(1);
    }
  }
}
