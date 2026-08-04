const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import BookFlow
if (!code.includes("import { BookFlow }")) {
  code = code.replace("import { saveProject", "import { BookFlow } from './BookFlow';\nimport { saveProject");
}

// 2. Add BookFlow button to Dashboard project cards
const regex1 = /<span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Open Editor &rarr;<\/span>/;
const replace1 = `<button 
                              onClick={(e) => { e.stopPropagation(); setView('bookflow'); setCurrentProject(p); }}
                              className="text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                              BookFlow
                            </button>
                            <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Open Editor &rarr;</span>`;
code = code.replace(regex1, replace1);

// 3. Update the main view logic
const regex2 = /\{view === 'dashboard' \? \(/;
const replace2 = `{view === 'dashboard' ? (`; // find position
code = code.replace(regex2, replace2); // no-op

const regex3 = /<\/div>\s*<\/div>\s*\) : \(\s*<section/;
const replace3 = `          </div>\n        ) : view === 'bookflow' && currentProject ? (\n          <BookFlow project={currentProject} onUpdateProject={(p) => { setCurrentProject(p); setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)); }} />\n        ) : (\n        <section`;
code = code.replace(regex3, replace3);

fs.writeFileSync('src/App.tsx', code);
