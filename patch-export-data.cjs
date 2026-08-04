const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '{currentProject?.bookFlowData && (',
  '{currentProject && ('
);
code = code.replace(
  '<CoverPage value={currentProject.bookFlowData.coverBook} onChange={()=>{}} />',
  '<CoverPage value={currentProject.bookFlowData?.coverBook} onChange={()=>{}} />'
);
code = code.replace(
  '<CopyrightPage value={currentProject.bookFlowData.copyrightPage} onChange={()=>{}} />',
  '<CopyrightPage value={currentProject.bookFlowData?.copyrightPage} onChange={()=>{}} />'
);
code = code.replace(
  '<WelcomePage value={currentProject.bookFlowData.welcomePage} onChange={()=>{}} />',
  '<WelcomePage value={currentProject.bookFlowData?.welcomePage} onChange={()=>{}} />'
);
code = code.replace(
  '<MysteryPage value={currentProject.bookFlowData.mystery} onChange={()=>{}} />',
  '<MysteryPage value={currentProject.bookFlowData?.mystery} onChange={()=>{}} />'
);
code = code.replace(
  '<TemplatePage title="Warm up practice" value={currentProject.bookFlowData.warmUpPractice} type="warmup" onChange={()=>{}} />',
  '<TemplatePage title="Warm up practice" value={currentProject.bookFlowData?.warmUpPractice} type="warmup" onChange={()=>{}} />'
);
code = code.replace(
  '<TemplatePage title="Pen Testing lab" value={currentProject.bookFlowData.penTestingLab} type="pentesting" onChange={()=>{}} />',
  '<TemplatePage title="Pen Testing lab" value={currentProject.bookFlowData?.penTestingLab} type="pentesting" onChange={()=>{}} />'
);

fs.writeFileSync('src/App.tsx', code);
