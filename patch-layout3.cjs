const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldLayout = `
              {images.map((imgObj, i) => (
                <div key={i} className="relative mt-12 mb-4">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex flex-wrap justify-center gap-6 items-center w-max max-w-[90vw] bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm z-30 print:hidden" onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}>
`;

const newLayout = `
              {images.map((imgObj, i) => (
                <div key={i} className="flex flex-col items-center gap-4 my-8">
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 items-center max-w-full bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-neutral-200 shadow-sm z-30 print:hidden" onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}>
`;

code = code.replace(oldLayout, newLayout);
fs.writeFileSync('src/App.tsx', code);
