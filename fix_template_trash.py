import re

with open('src/BookFlow.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    '''                 <button 
                     onClick={() => removeTemplateImage()}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 print:hidden"
                 >
                    <Trash2 size={24} />
                 </button>}''',
    '''                 {!isExport && (
                   <button 
                       onClick={() => removeTemplateImage()}
                      className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 print:hidden"
                   >
                      <Trash2 size={24} />
                   </button>
                 )}'''
)

code = code.replace(
    '''              {!isExport && <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="w-full h-full border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center transition-colors rounded-xl print:hidden text-neutral-400"
              >
                 <ImageIcon size={32} />
                 <p className="mt-4 text-sm font-medium">Click to add image</p>
              </div>}''',
    '''              {!isExport && (
                <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-full h-full border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center transition-colors rounded-xl print:hidden text-neutral-400"
                >
                   <ImageIcon size={32} />
                   <p className="mt-4 text-sm font-medium">Click to add image</p>
                </div>
              )}'''
)

with open('src/BookFlow.tsx', 'w') as f:
    f.write(code)
