const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /<aside className="w-64 bg-white border-r border-neutral-200 p-3\.5 flex flex-col gap-1\.5 overflow-y-auto shrink-0 custom-scrollbar">\s*<div className="flex flex-col gap-2 pb-2 border-b border-neutral-100">\s*<button[\s\S]*?<LayoutDashboard size=\{16\} \/>\s*Dashboard\s*<\/button>\s*<\/div>\s*\{view === 'editor' && \(\s*<div className="flex flex-col gap-1\.5">/;

const replace1 = `{view === 'editor' && (
          <aside className="w-64 bg-white border-r border-neutral-200 p-3.5 flex flex-col gap-1.5 overflow-y-auto shrink-0 custom-scrollbar">
            <div className="flex flex-col gap-1.5">`;

code = code.replace(regex1, replace1);

const regex2 = /<\/div>\s*\)\}\s*<\/aside>/;
const replace2 = `            </div>\n          </aside>\n        )}`;

code = code.replace(regex2, replace2);

fs.writeFileSync('src/App.tsx', code);
