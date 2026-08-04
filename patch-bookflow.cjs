const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /<div className="flex flex-col gap-2 pb-2 border-b border-neutral-100">\s*<button\s*onClick=\{([^}]+)\}\s*className=\{`([^`]+)`\}\s*>\s*<LayoutDashboard size=\{16\} \/>\s*Dashboard\s*<\/button>\s*<\/div>/;

const replace1 = `<div className="flex flex-col gap-2 pb-2 border-b border-neutral-100">
              <button 
                onClick={() => setView('dashboard')}
                className={\`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === 'dashboard' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}\`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              {(view === 'editor' || view === 'bookflow') && currentProject && (
                <button 
                  onClick={() => setView('bookflow')}
                  className={\`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === 'bookflow' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}\`}
                >
                  <BookText size={16} />
                  BookFlow
                </button>
              )}
            </div>`;

code = code.replace(regex1, replace1);

const regex2 = /\{view === 'editor' && \(/;
const replace2 = `{(view === 'editor' || view === 'bookflow') && (`;
code = code.replace(regex2, replace2);
// Wait, the block is for the editor's tools... I should change the block that shows editor tools to ONLY show when view === 'editor'.

fs.writeFileSync('src/App.tsx', code);
