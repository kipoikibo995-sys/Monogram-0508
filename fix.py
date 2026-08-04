import re

with open('src/BookFlow.tsx', 'r') as f:
    code = f.read()

# Fix Cover custom trash
code = code.replace(
    '''                  <img src={src} alt={`Cover ${idx}`} className="w-full h-full object-cover" />
                  <button 
                     onClick={() => removeImage(idx)}
                    className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={24} />
                  </button>)}''',
    '''                  <img src={src} alt={`Cover ${idx}`} className="w-full h-full object-cover" />
                  {!isExport && (
                    <button 
                       onClick={() => removeImage(idx)}
                      className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={24} />
                    </button>
                  )}'''
)

code = code.replace(
    '''                  <button 
                     onClick={() => removeImage(idx)}
                    className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={24} />
                  </button>}''',
    '''                  {!isExport && (
                    <button 
                       onClick={() => removeImage(idx)}
                      className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={24} />
                    </button>
                  )}'''
)

# Fix Template item trash
code = code.replace(
    '''                <button onClick={() => removeListItem(idx)} className="absolute -right-6 top-1 text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                  <Trash2 size={16} />
                </button>)}''',
    '''                {!isExport && (
                  <button onClick={() => removeListItem(idx)} className="absolute -right-6 top-1 text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                    <Trash2 size={16} />
                  </button>
                )}'''
)

code = code.replace(
    '''                <button onClick={() => removeListItem(idx)} className="absolute -right-6 top-1 text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                  <Trash2 size={16} />
                </button>}''',
    '''                {!isExport && (
                  <button onClick={() => removeListItem(idx)} className="absolute -right-6 top-1 text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                    <Trash2 size={16} />
                  </button>
                )}'''
)

# Fix Template item add
code = code.replace(
    '''            {!isExport && <button onClick={addListItem} className="text-neutral-600 hover:text-black text-sm text-left hover:underline print:hidden mt-0.5">
              <Plus size={14} /> Add Item
            </button>)}''',
    '''            {!isExport && (
              <button onClick={addListItem} className="text-neutral-600 hover:text-black text-sm text-left hover:underline print:hidden mt-0.5">
                <Plus size={14} /> Add Item
              </button>
            )}'''
)

code = code.replace(
    '''            {!isExport && <button onClick={addListItem} className="text-neutral-600 hover:text-black text-sm text-left hover:underline print:hidden mt-0.5">
              <Plus size={14} /> Add Item
            </button>}''',
    '''            {!isExport && (
              <button onClick={addListItem} className="text-neutral-600 hover:text-black text-sm text-left hover:underline print:hidden mt-0.5">
                <Plus size={14} /> Add Item
              </button>
            )}'''
)


with open('src/BookFlow.tsx', 'w') as f:
    f.write(code)
