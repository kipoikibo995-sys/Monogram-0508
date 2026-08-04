const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

const regexCover = /\/\/ --- CoverPage Component ---\nconst CoverPage = \(\{ value, onChange \}: \{ value\?: string; onChange: \(v: string\) => void \}\) => \{[\s\S]*?\n\};\n/g;

const replaceCover = `// --- CoverPage Component ---
const CoverPage = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
  let parsedValue = {
    topSubtitle: 'ONE COLOR COLORING BOOK',
    numberText: '101',
    subtitle2: 'Color by Number',
    mainTitle: 'MONOCHROME',
    themeTitle: 'SPOOKY MYSTERIES',
    author: 'ALAN PARKER',
    image: ''
  };

  try {
    if (value && value.startsWith('{')) {
      parsedValue = { ...parsedValue, ...JSON.parse(value) };
    } else if (value) {
      parsedValue.image = value;
    }
  } catch (e) {}

  const handleChange = (key: string, val: string) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      handleChange('image', e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between h-full bg-white relative font-sans w-full p-2">
       {/* Top Section */}
       <div className="w-full flex flex-col items-center mt-2 relative z-10">
          <input 
            value={parsedValue.topSubtitle} 
            onChange={e => handleChange('topSubtitle', e.target.value)}
            className="text-center text-[28px] tracking-[0.05em] text-neutral-800 outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 uppercase rounded-md transition-colors"
            placeholder="Top Subtitle"
          />
          
          <div className="flex items-center justify-center gap-3 w-full mt-2">
            <input 
              value={parsedValue.numberText} 
              onChange={e => handleChange('numberText', e.target.value)}
              className="text-right font-black text-[96px] outline-none w-[170px] bg-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              placeholder="101"
            />
            <input 
              value={parsedValue.subtitle2} 
              onChange={e => handleChange('subtitle2', e.target.value)}
              className="text-left font-black text-[64px] text-neutral-900 outline-none flex-1 bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 tracking-tighter rounded-md transition-colors"
              placeholder="Color by Number"
            />
          </div>

          <input 
            value={parsedValue.mainTitle} 
            onChange={e => handleChange('mainTitle', e.target.value)}
            className="text-center font-black text-[120px] text-neutral-900 outline-none w-full bg-transparent tracking-tighter leading-[0.9] hover:bg-neutral-100 focus:bg-neutral-50 -mt-2 rounded-md transition-colors"
            placeholder="MONOCHROME"
          />
          
          <input 
            value={parsedValue.themeTitle} 
            onChange={e => handleChange('themeTitle', e.target.value)}
            className="text-center font-bold text-[56px] text-neutral-900 outline-none w-full bg-transparent leading-none hover:bg-neutral-100 focus:bg-neutral-50 -mt-1 rounded-md transition-colors"
            placeholder="SPOOKY MYSTERIES"
          />
       </div>

       {/* Image Section */}
       <div 
          className={\`flex-1 w-full flex items-center justify-center my-4 relative group z-0 min-h-[300px] \${isDragging ? 'opacity-80' : ''}\`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
       >
          {parsedValue.image ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={parsedValue.image} alt="Cover graphic" className="max-w-full max-h-full object-contain mix-blend-multiply" />
              <button 
                onClick={() => handleChange('image', '')}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-red-50 text-neutral-600 hover:text-red-600 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={\`w-3/4 h-full border-4 border-dashed \${isDragging ? 'border-purple-500 bg-purple-50' : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'} cursor-pointer flex flex-col items-center justify-center transition-colors rounded-2xl\`}
            >
              <Upload size={48} className={\`\${isDragging ? 'text-purple-500' : 'text-neutral-400'} mb-4\`} />
              <p className={\`\${isDragging ? 'text-purple-600' : 'text-neutral-500'} font-medium text-xl\`}>
                {isDragging ? 'Drop image here' : 'Click to upload cover graphic'}
              </p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
       </div>

       {/* Bottom Section */}
       <div className="w-full mb-8 relative z-10">
          <input 
            value={parsedValue.author} 
            onChange={e => handleChange('author', e.target.value)}
            className="text-center text-[28px] tracking-[0.1em] text-neutral-800 outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 uppercase rounded-md transition-colors"
            placeholder="AUTHOR NAME"
          />
       </div>
    </div>
  )
};
`;

code = code.replace(regexCover, replaceCover);
fs.writeFileSync('src/BookFlow.tsx', code);
