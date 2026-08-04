const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

code = code.replace(
  /<Text style=\{\{ width: 80, textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: 16 \}\}>Mark<\/Text>/g,
  `<Text style={{ width: 80, textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: 16 }}>Ký hiệu</Text>`
);
code = code.replace(
  /<Text style=\{\{ width: 80, textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: 16 \}\}>Code<\/Text>/g,
  `<Text style={{ width: 80, textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: 16 }}>Mã</Text>`
);
code = code.replace(
  /<Text style=\{\{ flex: 1, fontFamily: 'Helvetica-Bold', fontSize: 16 \}\}>Name<\/Text>/g,
  `<Text style={{ flex: 1, fontFamily: 'Helvetica-Bold', fontSize: 16 }}>Tên gọi</Text>`
);
code = code.replace(
  /<Text style=\{\{ width: 100, textAlign: 'right', fontFamily: 'Helvetica-Bold', fontSize: 16 \}\}>Density %<\/Text>/g,
  `<Text style={{ width: 100, textAlign: 'right', fontFamily: 'Helvetica-Bold', fontSize: 16 }}>Mật độ %</Text>`
);

code = code.replace(
  /Bản quyền © \{copyright\.year\}/g,
  `Bản quyền © {copyright.year}`
);
code = code.replace(
  /Copyright © \{copyright\.year\}/g,
  `Bản quyền © {copyright.year}`
);

code = code.replace(
  /Imprint:/g,
  `Nhà xuất bản:`
);

code = code.replace(
  /GRID #/g,
  `Ô LƯỚI #`
);

fs.writeFileSync('src/PdfExport.tsx', code);
console.log("PdfExport headers translated");
