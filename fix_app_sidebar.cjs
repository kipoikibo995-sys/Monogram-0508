const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const [activeBookFlowPage, setActiveBookFlowPage] = useState<'cover' | 'copyright' | 'welcome' | 'warmup' | 'pentesting' | 'mystery'>('cover');",
  "const [activeBookFlowPage, setActiveBookFlowPage] = useState<'cover' | 'copyright' | 'welcome' | 'warmup' | 'pentesting' | 'mystery' | 'thankyou'>('cover');"
);

code = code.replace(
  "{ id: 'mystery', title: 'Mystery Instructions', icon: <FileText size={14} /> },",
  "{ id: 'mystery', title: 'Mystery Instructions', icon: <FileText size={14} /> },\n                        { id: 'thankyou', title: 'Thank You Page', icon: <FileText size={14} /> },"
);

fs.writeFileSync('src/App.tsx', code);
