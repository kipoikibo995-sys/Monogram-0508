const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  '<button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">\\n              <Download size={16} />\\n              Export\\n            </button>',
  '<button onClick={onExport} className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">\\n              <Download size={16} />\\n              Export\\n            </button>'
);
// let's just do a regex replace
code = code.replace(/<button className="flex items-center gap-2 px-3 py-1\.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">\s*<Download size=\{16\} \/>\s*Export\s*<\/button>/g, '<button onClick={onExport} className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm"><Download size={16} />Export</button>');

fs.writeFileSync('src/BookFlow.tsx', code);
