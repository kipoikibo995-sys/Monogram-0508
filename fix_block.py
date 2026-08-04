import re

with open('src/BookFlow.tsx', 'r') as f:
    code = f.read()

# Replace the mangled part
# The original structure was:
#           <div className="flex-1 flex items-end justify-center w-full min-h-0 relative group">
#              {parsedValue.illustrationImage ? (
#                <div className="relative w-full h-full flex items-center justify-center p-2">
#                  <img src={parsedValue.illustrationImage} alt="Illustration" className="max-w-[90%] max-h-full object-contain mix-blend-multiply" />
#                  {!isExport && (
#                     <button 
#                        onClick={() => handleChange('illustrationImage', '')}
#                        className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 print:hidden"
#                     >
#                        <Trash2 size={20} />
#                     </button>
#                  )}
#                </div>
#              ) : (
#                {!isExport && (
#                  <div 
#                     onClick={() => fileInputRef.current?.click()}
#                     className="w-full h-full border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center transition-colors rounded-xl print:hidden text-neutral-400"
#                  >
#                     <Upload size={32} className="mb-2" />
#                     <p className="text-sm font-medium text-center">Click to upload illustration<br/>(Book/Pen graphic)</p>
#                  </div>
#                )}
#              )}

# Note that inside a ternary, `{!isExport && ...}` will evaluate to `false` if isExport is true, which React renders as nothing (which is fine). 
# However, the JSX parsing requires us to write it without `{}` if we are inside `{ condition ? A : B }`. 
# Wait, `( !isExport && <div.../> )` is the correct syntax.

fixed = '''          <div className="flex-1 flex items-end justify-center w-full min-h-0 relative group">
             {parsedValue.illustrationImage ? (
               <div className="relative w-full h-full flex items-center justify-center p-2">
                 <img src={parsedValue.illustrationImage} alt="Illustration" className="max-w-[90%] max-h-full object-contain mix-blend-multiply" />
                 {!isExport && (
                   <button 
                       onClick={() => handleChange('illustrationImage', '')}
                      className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 print:hidden"
                   >
                      <Trash2 size={20} />
                   </button>
                 )}
               </div>
             ) : (
               !isExport ? (
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center transition-colors rounded-xl print:hidden text-neutral-400"
                 >
                    <Upload size={32} className="mb-2" />
                    <p className="text-sm font-medium text-center">Click to upload illustration<br/>(Book/Pen graphic)</p>
                 </div>
               ) : null
             )}
             <input 
                type="file" 
                ref={fileInputRef}
               className="hidden" 
                accept="image/*"
               onChange={handleImageUpload}
             />
          </div>'''

mangled = re.search(r'          <div className="flex-1 flex items-end justify-center w-full min-h-0 relative group">.*?onChange=\{handleImageUpload\}\n             />\n          </div>', code, re.DOTALL)
if mangled:
    code = code[:mangled.start()] + fixed + code[mangled.end():]
else:
    print("Could not find block to replace.")

with open('src/BookFlow.tsx', 'w') as f:
    f.write(code)
