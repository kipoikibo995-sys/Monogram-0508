const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

// The removeListItem button in TemplatePage
code = code.replace(
  "<button onClick={() => removeListItem(idx)} className=\"absolute -right-6 top-1 text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity print:hidden\">",
  "{!isExport && <button onClick={() => removeListItem(idx)} className=\"absolute -right-6 top-1 text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity print:hidden\">"
);
code = code.replace(
  "                  <Trash2 size={16} />\n                </button>",
  "                  <Trash2 size={16} />\n                </button>}"
);

// The add item button in TemplatePage
code = code.replace(
  "+ Add Item\n            </button>",
  "+ Add Item\n            </button>}"
);


// The trash button in custom mode in CoverPage
code = code.replace(
  "                  <button \n                     onClick={() => removeImage(idx)}",
  "                  {!isExport && <button \n                     onClick={() => removeImage(idx)}"
);
code = code.replace(
  "                    <Trash2 size={24} />\n                  </button>",
  "                    <Trash2 size={24} />\n                  </button>}"
);


// The trash button in template mode in CoverPage
code = code.replace(
  "                 <button \n                     onClick={() => removeTemplateImage()}",
  "                 {!isExport && <button \n                     onClick={() => removeTemplateImage()}"
);
code = code.replace(
  "                    <Trash2 size={24} />\n                 </button>",
  "                    <Trash2 size={24} />\n                 </button>}"
);


fs.writeFileSync('src/BookFlow.tsx', code);
