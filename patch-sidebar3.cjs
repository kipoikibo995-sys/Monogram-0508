const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /\{view === 'editor' && \(\s*<aside className="w-64 bg-white border-r border-neutral-200 p-3\.5 flex flex-col gap-1\.5 overflow-y-auto shrink-0 custom-scrollbar">\s*<div className="flex flex-col gap-2 pb-2 border-b border-neutral-100">/;

const replace1 = `<aside className="w-64 bg-white border-r border-neutral-200 p-3.5 flex flex-col gap-1.5 overflow-y-auto shrink-0 custom-scrollbar">
            <div className="flex flex-col gap-2 pb-2 border-b border-neutral-100">`;

code = code.replace(regex1, replace1);

const regex2 = /Dashboard\s*<\/button>\s*<\/div>\s*<div className="flex flex-col gap-1\.5">/;

const replace2 = `Dashboard
              </button>
            </div>
            {view === 'editor' && (
            <div className="flex flex-col gap-1.5">`;

code = code.replace(regex2, replace2);

const regex3 = /<\/div>\s*<\/aside>\s*\)\}/;
const replace3 = `            </div>\n            )}\n          </aside>`;

code = code.replace(regex3, replace3);

const regex4 = /className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"/;
const replace4 = "className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold ${view === 'dashboard' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}`}";
code = code.replace(regex4, replace4);


fs.writeFileSync('src/App.tsx', code);
