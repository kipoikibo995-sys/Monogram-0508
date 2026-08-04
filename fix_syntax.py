import re

with open('src/BookFlow.tsx', 'r') as f:
    code = f.read()

# Replace the mangled part around removeImage
mangled = re.search(r'\{!isExport && <button .*?\{imgCount < 4 && !isExport && \(', code, re.DOTALL)
if mangled:
    fixed = '''{!isExport && (
                    <button 
                      onClick={() => removeImage(idx)}
                      className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={24} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {imgCount < 4 && !isExport && ('''
    code = code[:mangled.start()] + fixed + code[mangled.end():]


# Fix the mangled part around fileInputRef
# We have:
#               {(!isExport) ? <div 
#                   onClick={() => fileInputRef.current?.click()}
#                  className="w-full h-full border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center transition-colors rounded-xl print:hidden text-neutral-400"
#                >
#                  <Upload size={32} className="mb-2" />
#                  <p className="text-sm font-medium text-center">Click to upload illustration<br/>(Book/Pen graphic)</p>
#                </div>
#              )}
mangled2 = re.search(r'\{\(!isExport\) \? <div .*?</div> : <div className="w-full h-full"></div>\}\n', code, re.DOTALL)
if mangled2:
    fixed2 = '''{!isExport && (
              <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="w-full h-full border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center transition-colors rounded-xl print:hidden text-neutral-400"
              >
                 <Upload size={32} className="mb-2" />
                 <p className="text-sm font-medium text-center">Click to upload illustration<br/>(Book/Pen graphic)</p>
              </div>
             )}
'''
    code = code[:mangled2.start()] + fixed2 + code[mangled2.end():]

with open('src/BookFlow.tsx', 'w') as f:
    f.write(code)
