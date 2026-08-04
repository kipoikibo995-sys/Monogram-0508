const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldLayout = `
              {images.map((imgObj, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="flex justify-between items-center bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm z-30 print:hidden" onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}>
`;

const newLayout = `
              {images.map((imgObj, i) => (
                <div key={i} className="relative mt-12 mb-4">
                  <div className="absolute bottom-full left-0 right-0 mb-3 flex flex-wrap justify-between items-center bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm z-30 print:hidden" onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}>
`;

code = code.replace(oldLayout, newLayout);
fs.writeFileSync('src/App.tsx', code);
