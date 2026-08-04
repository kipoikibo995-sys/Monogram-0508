const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  "{ id: 'mystery', title: 'Mystery Instructions', icon: <FileText size={18} /> },",
  "{ id: 'mystery', title: 'Mystery Instructions', icon: <FileText size={18} /> },\n    { id: 'thankyou', title: 'Thank You Page', icon: <FileText size={18} /> },"
);

code = code.replace(
  "case 'pentesting':\n        return <TemplatePage title=\"Pen Testing lab\" value={data.penTestingLab} onChange={(v) => handleUpdateData('penTestingLab', v)} type=\"pentesting\" />;",
  "case 'pentesting':\n        return <TemplatePage title=\"Pen Testing lab\" value={data.penTestingLab} onChange={(v) => handleUpdateData('penTestingLab', v)} type=\"pentesting\" />;\n      case 'thankyou':\n        return <ThankYouPage value={data.thankyou} onChange={(v) => handleUpdateData('thankyou', v)} />;"
);

fs.writeFileSync('src/BookFlow.tsx', code);
