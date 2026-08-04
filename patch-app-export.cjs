const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importBookflow = `import { BookFlow, CoverPage, CopyrightPage, WelcomePage, MysteryPage, TemplatePage } from './BookFlow';`;
if (code.includes('import { BookFlow } from')) {
    code = code.replace(/import \{ BookFlow \} from '\.\/BookFlow';/g, importBookflow);
} else {
    code = importBookflow + '\n' + code;
}

code = code.replace(
  `import { Project, listProjects, saveProject, deleteProject } from './db';`,
  `import { Project, listProjects, saveProject, deleteProject } from './db';\nimport html2canvas from 'html2canvas';`
);

fs.writeFileSync('src/App.tsx', code);
