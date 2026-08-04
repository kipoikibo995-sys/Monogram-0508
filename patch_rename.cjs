const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `alert("SVG Export (ZIP) is a Pro feature. Please upgrade.")`,
  `alert("Export SVG (Full photo) is a Pro feature. Please upgrade.")`
);

code = code.replace(
  `<div className="flex items-center gap-2"><Download size={14} /> Export SVG (ZIP)</div>`,
  `<div className="flex items-center gap-2"><Download size={14} /> Export SVG (Full photo)</div>`
);

code = code.replace(
  `alert("PNG Export (ZIP) is a Pro feature. Please upgrade.")`,
  `alert("Export PNG (Full photo) is a Pro feature. Please upgrade.")`
);

code = code.replace(
  `<div className="flex items-center gap-2"><Download size={14} /> Export PNG (ZIP)</div>`,
  `<div className="flex items-center gap-2"><Download size={14} /> Export PNG (Full photo)</div>`
);

fs.writeFileSync('src/App.tsx', code);
