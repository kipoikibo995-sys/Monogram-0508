const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldGridStr = `<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">`;
const newGridStr = `<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">`;

const oldCreateBtnStr = `className="bg-white border-2 border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center gap-4 transition-all hover:bg-neutral-50 hover:border-neutral-300 group min-h-[280px]"`;
const newCreateBtnStr = `className="bg-white border-2 border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center gap-4 transition-all hover:bg-neutral-50 hover:border-neutral-300 group aspect-[2/3] min-h-[200px]"`;

const oldCardStr = `className="relative bg-[#111111] rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col min-h-[280px] overflow-hidden"`;
const newCardStr = `className="relative bg-[#111111] rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col aspect-[2/3] min-h-[200px] overflow-hidden"`;

code = code.replace(oldGridStr, newGridStr);
code = code.replace(oldCreateBtnStr, newCreateBtnStr);
code = code.replace(oldCardStr, newCardStr);

fs.writeFileSync('src/App.tsx', code);
