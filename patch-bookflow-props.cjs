const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  '  activePage: PageType;\n}',
  '  activePage: PageType;\n  onExport: () => void;\n}'
);

code = code.replace(
  'export const BookFlow: React.FC<BookFlowProps> = ({ project, onUpdateProject, activePage }) => {',
  'export const BookFlow: React.FC<BookFlowProps> = ({ project, onUpdateProject, activePage, onExport }) => {'
);

code = code.replace(
  '<Download size={16} />\n              Export\n            </button>',
  '<Download size={16} />\n              Export\n            </button>'.replace('<button ', '<button onClick={onExport} ')
);

fs.writeFileSync('src/BookFlow.tsx', code);
