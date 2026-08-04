const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  "type PageType = 'cover' | 'copyright' | 'welcome' | 'warmup' | 'pentesting' | 'mystery';",
  "type PageType = 'cover' | 'copyright' | 'welcome' | 'warmup' | 'pentesting' | 'mystery' | 'thankyou';"
);

fs.writeFileSync('src/BookFlow.tsx', code);
