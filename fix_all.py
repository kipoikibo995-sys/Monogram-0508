import re

with open('src/BookFlow.tsx', 'r') as f:
    code = f.read()

# Fix Cover custom trash
code = re.sub(
    r'<button \s*onClick=\{\(\) => removeImage\(idx\)\}\s*className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"\s*>\s*<Trash2 size=\{24\} />\s*</button>\)\}',
    r'{!isExport && (\n                    <button \n                      onClick={() => removeImage(idx)}\n                      className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"\n                    >\n                      <Trash2 size={24} />\n                    </button>\n                  )}',
    code
)

# Fix Template item trash
code = re.sub(
    r'\{!isExport && <button onClick=\{\(\) => removeListItem\(idx\)\} className="absolute -right-6 top-1 text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity print:hidden">\s*<Trash2 size=\{16\} />\s*</button>\}',
    r'{!isExport && (\n                  <button onClick={() => removeListItem(idx)} className="absolute -right-6 top-1 text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity print:hidden">\n                    <Trash2 size={16} />\n                  </button>\n                )}',
    code
)

# Fix Template item add
code = re.sub(
    r'\{!isExport && <button onClick=\{addListItem\} className="text-neutral-600 hover:text-black text-sm text-left hover:underline print:hidden mt-0\.5">\s*\+ Add Item\s*</button>\}',
    r'{!isExport && (\n              <button onClick={addListItem} className="text-neutral-600 hover:text-black text-sm text-left hover:underline print:hidden mt-0.5">\n                + Add Item\n              </button>\n            )}',
    code
)


with open('src/BookFlow.tsx', 'w') as f:
    f.write(code)
