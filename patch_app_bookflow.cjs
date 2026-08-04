const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `                          onClick={() => {
                            if (isLockedForUser) {
                              alert("This page is only available in the Pro version. Please upgrade to access it.");
                              return;
                            }
                            setActiveBookFlowPage(page.id as any);
                          }}`,
  `                          onClick={() => setActiveBookFlowPage(page.id as any)}`
);

code = code.replace(
  `                              : isLockedForUser
                                ? 'text-neutral-400 cursor-not-allowed'
                                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'`,
  `                              : isLockedForUser
                                ? 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700'
                                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'`
);

code = code.replace(
  `<BookFlow project={currentProject} onUpdateProject={(p) => { setCurrentProject(p); setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)); }} activePage={activeBookFlowPage} onExport={handleBulkExportPDF} />`,
  `<BookFlow project={currentProject} onUpdateProject={(p) => { setCurrentProject(p); setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)); }} activePage={activeBookFlowPage} onExport={handleBulkExportPDF} userTier={userTier} />`
);

fs.writeFileSync('src/App.tsx', code);
