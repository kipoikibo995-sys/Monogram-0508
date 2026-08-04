const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<BookFlow project={currentProject} onUpdateProject={updateProject} activePage={activeBookFlowPage} />',
  '<BookFlow project={currentProject} onUpdateProject={updateProject} activePage={activeBookFlowPage} onExport={handleBulkExportPDF} />'
);

code = code.replace(
  '<BookFlow project={currentProject} onUpdateProject={(p) => { setCurrentProject(p); setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)); }} activePage={activeBookFlowPage} />',
  '<BookFlow project={currentProject} onUpdateProject={(p) => { setCurrentProject(p); setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)); }} activePage={activeBookFlowPage} onExport={handleBulkExportPDF} />'
);

fs.writeFileSync('src/App.tsx', code);
