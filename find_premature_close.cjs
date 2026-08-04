const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const appStart = code.indexOf('export default function App() {');
const appBlock = code.substring(appStart);

let depth = 0;
for (let i = 0; i < appBlock.length; i++) {
  if (appBlock[i] === '{') depth++;
  else if (appBlock[i] === '}') {
    depth--;
    if (depth === 0) {
      console.log('App closed at index', i, appBlock.substring(i - 40, i + 40));
      break;
    }
  }
}
