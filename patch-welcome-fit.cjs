const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

const regexReplace = /\/\/ --- WelcomePage Component ---\nconst WelcomePage = \(\{ value, onChange \}: \{ value\?: string; onChange: \(v: string\) => void \}\) => \{[\s\S]*?\n\};\n/g;

const welcomeComponent = `// --- WelcomePage Component ---
const WelcomePage = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
  let parsedValue = {
    title: 'WELCOME TO MONOCHROME COLOR QUEST',
    intro: 'Discover the relaxing joy of revealing beautiful monochrome artwork—\\none mark at a time.\\nInside this book you\\'ll uncover 101 hidden illustrations, including\\nmajestic wildlife, adorable pets, colorful birds and more',
    howToTitle: 'HOW TO USE THIS BOOK',
    howToSteps: 'Each square contains a number.\\n\\nMatch the number with the symbol\\nshown in the legend below the\\npuzzle.\\n\\nUsing a black pen, fill every square\\nwith the correct symbol.',
    penTitle: 'PEN RECOMMENDATIONS',
    penIntro: 'For the best results, we\\nrecommend:',
    penList: ['Fine liner (0.4–0.6 mm)', 'Black gel pen', 'Black ballpoint pen'],
    penOutro: 'Avoid permanent markers or\\nalcohol-based markers, as they\\nmay bleed through the paper.\\n\\nIf you\\'re using a very wet pen,\\nplace a blank sheet behind the\\npage to protect the next puzzle.',
    legend: [
      { num: '0', title: 'DOT', desc: 'Center Dot only', symbol: '•' },
      { num: '1', title: 'SLASH', desc: 'Single slash (/)', symbol: '/' },
      { num: '2', title: 'BACKSLASH', desc: 'Single backslash (\\\\)', symbol: '\\\\' },
      { num: '3', title: 'X', desc: 'Cross mark (X)', symbol: '✕' },
      { num: '4', title: 'ASTERISK', desc: 'Asterisk (*)', symbol: '✱' },
      { num: '5', title: 'FILLED SQUARE', desc: 'Solid black square', symbol: '■' }
    ],
    illustrationImage: ''
  };

  try {
    if (value) {
      if (value.startsWith('{')) {
        parsedValue = { ...parsedValue, ...JSON.parse(value) };
      } else {
        parsedValue.intro = value;
      }
    }
  } catch(e) {}

  const handleChange = (key: string, val: any) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };
  
  const handleListChange = (index: number, val: string) => {
    const newList = [...parsedValue.penList];
    newList[index] = val;
    handleChange('penList', newList);
  };
  
  const addListItem = () => {
    handleChange('penList', [...parsedValue.penList, 'New item']);
  };

  const removeListItem = (index: number) => {
    const newList = [...parsedValue.penList];
    newList.splice(index, 1);
    handleChange('penList', newList);
  };

  const handleLegendChange = (index: number, field: string, val: string) => {
    const newLegend = [...parsedValue.legend];
    newLegend[index] = { ...newLegend[index], [field]: val };
    handleChange('legend', newLegend);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('illustrationImage', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 w-full h-full bg-white flex flex-col font-sans relative overflow-hidden">
      <input
        value={parsedValue.title}
        onChange={(e) => handleChange('title', e.target.value)}
        className="text-[26px] font-bold text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors uppercase mb-3 shrink-0"
      />
      
      <textarea
        value={parsedValue.intro}
        onChange={(e) => handleChange('intro', e.target.value)}
        className="w-full resize-none outline-none bg-transparent text-[18px] leading-[1.4] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black mb-6 shrink-0"
        rows={4}
      />
      
      <div className="flex w-full gap-8 flex-1 min-h-0">
        {/* Left Column */}
        <div className="w-[45%] flex flex-col min-h-0">
          <input
            value={parsedValue.howToTitle}
            onChange={(e) => handleChange('howToTitle', e.target.value)}
            className="text-[20px] font-bold text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors uppercase mb-2 shrink-0"
          />
          
          <textarea
            value={parsedValue.howToSteps}
            onChange={(e) => handleChange('howToSteps', e.target.value)}
            className="w-full resize-none outline-none bg-transparent text-[18px] leading-[1.4] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black mb-4 shrink-0"
            rows={7}
          />
          
          <input
            value={parsedValue.penTitle}
            onChange={(e) => handleChange('penTitle', e.target.value)}
            className="text-[20px] font-bold text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors uppercase mb-1 shrink-0"
          />
          
          <textarea
            value={parsedValue.penIntro}
            onChange={(e) => handleChange('penIntro', e.target.value)}
            className="w-full resize-none outline-none bg-transparent text-[18px] leading-[1.4] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black mb-1 shrink-0"
            rows={2}
          />
          
          <div className="flex flex-col gap-0.5 mb-2 shrink-0">
            {parsedValue.penList.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 group relative">
                <span className="text-[18px] text-slate-500 font-bold leading-none mt-1">✓</span>
                <input
                   value={item}
                   onChange={(e) => handleListChange(idx, e.target.value)}
                   className="flex-1 outline-none bg-transparent text-[18px] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black"
                />
                <button onClick={() => removeListItem(idx)} className="absolute -right-6 top-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button onClick={addListItem} className="text-blue-500 text-sm text-left hover:underline print:hidden mt-0.5">
              + Add Item
            </button>
          </div>
          
          <textarea
            value={parsedValue.penOutro}
            onChange={(e) => handleChange('penOutro', e.target.value)}
            className="w-full flex-1 resize-none outline-none bg-transparent text-[18px] leading-[1.4] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black min-h-0"
          />
        </div>
        
        {/* Right Column */}
        <div className="w-[55%] flex flex-col pl-2 min-h-0">
          {/* Legend Table */}
          <div className="flex flex-col border border-neutral-100 rounded overflow-hidden mb-4 shadow-sm shrink-0">
            {parsedValue.legend.map((row, i) => (
              <div key={i} className={\`flex items-center p-2 border-b border-neutral-100 last:border-b-0 \${i % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}\`}>
                <div className="w-10 text-center font-bold text-base text-black">{row.num}</div>
                <div className="flex-1 flex flex-col justify-center px-2">
                  <input 
                    value={row.title}
                    onChange={(e) => handleLegendChange(i, 'title', e.target.value)}
                    className="font-bold text-sm tracking-widest outline-none bg-transparent hover:bg-neutral-200 focus:bg-neutral-200 rounded px-1 -ml-1 text-black"
                  />
                  <input 
                    value={row.desc}
                    onChange={(e) => handleLegendChange(i, 'desc', e.target.value)}
                    className="text-[11px] text-black outline-none bg-transparent hover:bg-neutral-200 focus:bg-neutral-200 rounded px-1 -ml-1 mt-0.5"
                  />
                </div>
                <div className="w-14 h-10 flex items-center justify-center border border-neutral-300 bg-white shadow-sm mr-1 text-lg font-bold">
                   {row.symbol === '■' ? <div className="w-5 h-5 bg-black"></div> : (
                     <input 
                       value={row.symbol}
                       onChange={(e) => handleLegendChange(i, 'symbol', e.target.value)}
                       className="w-full text-center outline-none bg-transparent"
                     />
                   )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Illustration Area */}
          <div className="flex-1 flex items-end justify-center w-full min-h-0 relative group">
             {parsedValue.illustrationImage ? (
               <div className="relative w-full h-full flex items-center justify-center p-2">
                 <img src={parsedValue.illustrationImage} alt="Illustration" className="max-w-[90%] max-h-full object-contain mix-blend-multiply" />
                 <button 
                    onClick={() => handleChange('illustrationImage', '')}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-50 text-neutral-600 hover:text-red-600 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 print:hidden"
                 >
                   <Trash2 size={20} />
                 </button>
               </div>
             ) : (
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="w-full h-full border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center transition-colors rounded-xl print:hidden text-neutral-400"
               >
                 <Upload size={32} className="mb-2" />
                 <p className="text-sm font-medium text-center">Click to upload illustration<br/>(Book/Pen graphic)</p>
               </div>
             )}
             <input 
               type="file" 
               ref={fileInputRef}
               className="hidden" 
               accept="image/*"
               onChange={handleImageUpload}
             />
          </div>
        </div>
      </div>
    </div>
  );
};
`;

code = code.replace(regexReplace, welcomeComponent);

fs.writeFileSync('src/BookFlow.tsx', code);
