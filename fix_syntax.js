const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

// Fix Cover Page Trash
code = code.replace(
  "                  {!isExport && <button \n                    <button \n                    className=\"absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100\"\n                  >\n                    <Trash2 size={24} />\n                  </button>}\n                    </button>\n                  )}",
  "                  {!isExport && (\n                    <button \n                      onClick={() => removeImage(idx)}\n                      className=\"absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100\"\n                    >\n                      <Trash2 size={24} />\n                    </button>\n                  )}"
);

// We need to be careful with the exact string. Let's just find the start of the map and replace it all.
