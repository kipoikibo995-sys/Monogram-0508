const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStr = `<div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-neutral-900">Your Books</h3>`;

const newStr = `<div className="flex flex-col gap-10 mt-6">
                    <div className="flex flex-col items-center justify-center text-center gap-6">
                      <h3 className="text-5xl md:text-6xl text-neutral-900 leading-tight" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}>
                        Your<br/>Library
                      </h3>
                      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-600">SAVED BOOKS</span>
                    </div>`;

if (code.includes(oldStr)) {
  code = code.replace(oldStr, newStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Success");
} else {
  console.log("Not found");
}
