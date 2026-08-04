const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  `interface BookFlowProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  activePage: PageType;
  onExport: () => void;
}`,
  `interface BookFlowProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  activePage: PageType;
  onExport: () => void;
  userTier?: 'free' | 'pro' | 'enterprise';
}`
);

code = code.replace(
  `export const BookFlow: React.FC<BookFlowProps> = ({ project, onUpdateProject, activePage, onExport }) => {`,
  `export const BookFlow: React.FC<BookFlowProps> = ({ project, onUpdateProject, activePage, onExport, userTier = 'free' }) => {`
);

code = code.replace(
  `import { Image as ImageIcon, FileText, Download, Upload, Type, Grid3X3, Trash2, ArrowLeft } from 'lucide-react';`,
  `import { Image as ImageIcon, FileText, Download, Upload, Type, Grid3X3, Trash2, ArrowLeft, Lock } from 'lucide-react';`
);

fs.writeFileSync('src/BookFlow.tsx', code);
