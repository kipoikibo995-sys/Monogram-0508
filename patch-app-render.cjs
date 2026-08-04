const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const hiddenElements = `
      {/* Hidden BookFlow Pages for Export */}
      {currentProject?.bookFlowData && (
        <div id="pdf-export-container" className="fixed top-[-9999px] left-[-9999px] flex flex-col gap-4 pointer-events-none opacity-0">
          <div id="export-page-cover" className="w-[850px] h-[1100px] bg-white"><CoverPage value={currentProject.bookFlowData.coverBook} onChange={()=>{}} /></div>
          <div id="export-page-copyright" className="w-[850px] h-[1100px] bg-white"><CopyrightPage value={currentProject.bookFlowData.copyrightPage} onChange={()=>{}} /></div>
          <div id="export-page-welcome" className="w-[850px] h-[1100px] bg-white"><WelcomePage value={currentProject.bookFlowData.welcomePage} onChange={()=>{}} /></div>
          <div id="export-page-mystery" className="w-[850px] h-[1100px] bg-white"><MysteryPage value={currentProject.bookFlowData.mystery} onChange={()=>{}} /></div>
          <div id="export-page-warmup" className="w-[850px] h-[1100px] bg-white"><TemplatePage title="Warm up practice" value={currentProject.bookFlowData.warmUpPractice} type="warmup" onChange={()=>{}} /></div>
          <div id="export-page-pentesting" className="w-[850px] h-[1100px] bg-white"><TemplatePage title="Pen Testing lab" value={currentProject.bookFlowData.penTestingLab} type="pentesting" onChange={()=>{}} /></div>
        </div>
      )}
`;

code = code.replace(
  `className="h-[100dvh] w-full overflow-hidden bg-neutral-50 flex flex-col font-sans text-neutral-900"\n    >`,
  `className="h-[100dvh] w-full overflow-hidden bg-neutral-50 flex flex-col font-sans text-neutral-900"\n    >\n${hiddenElements}`
);

fs.writeFileSync('src/App.tsx', code);
