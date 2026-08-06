const fs = require('fs');

const filesToUpdate = ['src/components/AdminView.tsx', 'src/PdfExport.tsx', 'src/App.tsx', 'src/BookFlow.tsx'];

for (const file of filesToUpdate) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/'free' \| 'pro' \| 'enterprise'/g, "'free' | 'regular' | 'pro'");
  code = code.replace(/value="enterprise">Enterprise/g, 'value="pro">Pro</option><option value="regular">Regular');
  code = code.replace(/=== 'enterprise'/g, "=== 'pro'");
  code = code.replace(/\? 'enterprise'/g, "? 'pro'");
  code = code.replace(/: 'enterprise'/g, ": 'pro'");
  fs.writeFileSync(file, code);
}
console.log("Patched src files for tiers");
