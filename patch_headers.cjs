const fs = require('fs');

let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  /<div className="w-24 text-center">Mark<\/div>/g,
  '<div className="w-24 text-center">Ký hiệu</div>'
);
code = code.replace(
  /<div className="w-24 text-center">Code<\/div>/g,
  '<div className="w-24 text-center">Mã</div>'
);
code = code.replace(
  /<div className="flex-1">Name<\/div>/g,
  '<div className="flex-1">Tên gọi</div>'
);
code = code.replace(
  /<div className="w-32 text-right">Density %<\/div>/g,
  '<div className="w-32 text-right">Mật độ %</div>'
);

code = code.replace(
  /<span>ISBN:<\/span>/g,
  '<span>ISBN:</span>'
);

code = code.replace(
  /<span>Imprint:<\/span>/g,
  '<span>Nhà xuất bản:</span>'
);

code = code.replace(
  /<span>Copyright ©<\/span>/g,
  '<span>Bản quyền ©</span>'
);

fs.writeFileSync('src/BookFlow.tsx', code);
console.log("BookFlow headers translated.");
