const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "<CopyrightPage value={currentProject.bookFlowData?.copyrightPage} onChange={()=>{}} />",
  "<CopyrightPage value={currentProject.bookFlowData?.copyrightPage} onChange={()=>{}} isExport />"
);
code = code.replace(
  "<WelcomePage value={currentProject.bookFlowData?.welcomePage} onChange={()=>{}} />",
  "<WelcomePage value={currentProject.bookFlowData?.welcomePage} onChange={()=>{}} isExport />"
);
code = code.replace(
  "<MysteryPage value={currentProject.bookFlowData?.mystery} onChange={()=>{}} />",
  "<MysteryPage value={currentProject.bookFlowData?.mystery} onChange={()=>{}} isExport />"
);
code = code.replace(
  "<TemplatePage title=\"Warm up practice\" value={currentProject.bookFlowData?.warmUpPractice} type=\"warmup\" onChange={()=>{}} />",
  "<TemplatePage title=\"Warm up practice\" value={currentProject.bookFlowData?.warmUpPractice} type=\"warmup\" onChange={()=>{}} isExport />"
);
code = code.replace(
  "<TemplatePage title=\"Pen Testing lab\" value={currentProject.bookFlowData?.penTestingLab} type=\"pentesting\" onChange={()=>{}} />",
  "<TemplatePage title=\"Pen Testing lab\" value={currentProject.bookFlowData?.penTestingLab} type=\"pentesting\" onChange={()=>{}} isExport />"
);

fs.writeFileSync('src/App.tsx', code);
