const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<style>\{`([\s\S]*?)`\}<\/style>/;
const match = code.match(regex);
if (match) {
  const newStyle = `
            @media print {
              @page { margin: 0; size: \${activeSettings.trimSize ? activeSettings.trimSize.replace('x', 'in ') + 'in' : '8.5in 11in'}; }
              body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .print-container { width: 100%; }
              .print-page { page-break-after: always; break-after: page; break-inside: avoid; overflow: hidden; width: \${activeSettings.trimSize ? activeSettings.trimSize.split('x')[0] + 'in' : '8.5in'}; height: \${activeSettings.trimSize ? activeSettings.trimSize.split('x')[1] + 'in' : '11in'}; position: relative; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; }
              .print-page > div { transform-origin: top left; transform: scale(0.95); width: 850px; height: 1100px; }
            }
            @media screen {
              .print-page { margin: 20px auto; border: 1px solid #ccc; width: \${activeSettings.trimSize ? activeSettings.trimSize.split('x')[0] + 'in' : '8.5in'}; height: \${activeSettings.trimSize ? activeSettings.trimSize.split('x')[1] + 'in' : '11in'}; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; background: white; }
              .print-page > div { transform: scale(0.95); width: 850px; height: 1100px; }
            }
          `;
  code = code.replace(regex, `<style>{\`${newStyle}\`}</style>`);
  
  // also fix the img width/height
  code = code.replace(/className="w-\[8\.5in\] h-\[11in\] object-contain"/g, 'className="w-full h-full object-contain"');
  fs.writeFileSync('src/App.tsx', code);
}
