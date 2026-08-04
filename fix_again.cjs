const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  "<button \n                     onClick={() => removeImage(idx)}",
  "{!isExport && <button \n                     onClick={() => removeImage(idx)}"
);

code = code.replace(
  "<button \n                     onClick={() => removeTemplateImage()}",
  "{!isExport && <button \n                     onClick={() => removeTemplateImage()}"
);

fs.writeFileSync('src/BookFlow.tsx', code);
