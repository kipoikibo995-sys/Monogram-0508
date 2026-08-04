with open('src/BookFlow.tsx', 'r') as f:
    lines = f.readlines()

def replace_line(line_num, new_text):
    lines[line_num - 1] = new_text

# 248:                     className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
# 249:                   >
# 250:                     <Trash2 size={24} />
# 251:                   </button>)}
replace_line(248, '                    className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"\n')
replace_line(249, '                  >\n')
replace_line(250, '                    <Trash2 size={24} />\n')
replace_line(251, '                  </button>\n')
replace_line(246, '                  {!isExport && <button \n')
replace_line(251, '                  </button>}\n')

# 675:                {!isExport && <div 
# 676:                   onClick={() => fileInputRef.current?.click()}
# 677:                  className="w-full h-full border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center transition-colors rounded-xl print:hidden text-neutral-400"
# 678:                >
# 679:                  <Upload size={32} className="mb-2" />
# 680:                  <p className="text-sm font-medium text-center">Click to upload illustration<br/>(Book/Pen graphic)</p>
# 681:                </div>
# 682:              )}
replace_line(675, '               {(!isExport) ? <div \n')
replace_line(682, '               </div> : <div className="w-full h-full"></div>}\n')

with open('src/BookFlow.tsx', 'w') as f:
    f.writelines(lines)
