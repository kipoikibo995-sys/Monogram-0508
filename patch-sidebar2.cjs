const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{view === 'editor' && \(\s*<aside className="w-64 bg-white border-r border-neutral-200 p-3\.5 flex flex-col gap-1\.5 overflow-y-auto shrink-0 custom-scrollbar">\s*<div className="flex flex-col gap-1\.5">/;

const replace = `{view === 'editor' && (
          <aside className="w-64 bg-white border-r border-neutral-200 p-3.5 flex flex-col gap-1.5 overflow-y-auto shrink-0 custom-scrollbar">
            <div className="flex flex-col gap-2 pb-2 border-b border-neutral-100">
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
            </div>
            <div className="flex flex-col gap-1.5">`;

code = code.replace(regex, replace);

fs.writeFileSync('src/App.tsx', code);
