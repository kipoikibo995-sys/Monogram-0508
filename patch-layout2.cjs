const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldLayout = `                  <div className="absolute bottom-full left-0 right-0 mb-3 flex flex-wrap justify-between items-center bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm z-30 print:hidden" onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}>`;

const newLayout = `                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex flex-wrap justify-center gap-6 items-center w-max max-w-[90vw] bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm z-30 print:hidden" onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}>`;

code = code.replace(oldLayout, newLayout);
fs.writeFileSync('src/App.tsx', code);
