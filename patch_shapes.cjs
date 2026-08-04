const fs = require('fs');

let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

const shapesCode = `
const SHAPES = [
  { name: 'Empty', code: '', index: 0 },
  { name: 'Dot', code: '.', index: 1 },
  { name: 'Slash', code: '1', index: 2 },
  { name: 'Backslash', code: '2', index: 3 },
  { name: 'Cross', code: '3', index: 4 },
  { name: 'Asterisk', code: '4', index: 5 },
  { name: 'Filled Square', code: '5', index: 6 },
];
`;

code = code.replace(
  "const getColumnLetter = (col: number): string => {",
  shapesCode + "\nconst getColumnLetter = (col: number): string => {"
);

fs.writeFileSync('src/PdfExport.tsx', code);
