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
    <div className="flex-1 flex flex-col items-center justify-between h-full bg-white relative">
       {/* Top Section */}
       <div className="w-full flex flex-col items-center gap-2 mt-4 px-8 relative z-10">
          <input 
            value={parsedValue.topSubtitle} 
            onChange={e => handleChange('topSubtitle', e.target.value)}
            className="text-center font-sans text-2xl tracking-[0.15em] text-neutral-800 outline-none w-full bg-transparent placeholder-neutral-300 transition-all hover:bg-neutral-50 focus:bg-white"
            placeholder="Top Subtitle"
          />
          <div className="flex items-center justify-center gap-4 w-full mt-6">
            <input 
              value={parsedValue.numberText} 
              onChange={e => handleChange('numberText', e.target.value)}
              className="text-right font-sans font-black text-[100px] outline-none w-[200px] bg-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 bg-clip-text text-transparent placeholder-neutral-300 leading-none transition-all hover:opacity-80"
              placeholder="101"
            />
            <input 
              value={parsedValue.subtitle2} 
              onChange={e => handleChange('subtitle2', e.target.value)}
              className="text-left font-sans font-black text-[70px] text-neutral-900 outline-none flex-1 bg-transparent placeholder-neutral-300 leading-none transition-all hover:bg-neutral-50 focus:bg-white tracking-tight"
              placeholder="Color by Number"
            />
          </div>
          <input 
            value={parsedValue.mainTitle} 
            onChange={e => handleChange('mainTitle', e.target.value)}
            className="text-center font-sans font-black text-[110px] text-neutral-900 outline-none w-full bg-transparent placeholder-neutral-300 tracking-tighter leading-[1] mt-2 transition-all hover:bg-neutral-50 focus:bg-white transform scale-y-110"
            placeholder="MONOCHROME"
          />
          <input 
            value={parsedValue.themeTitle} 
            onChange={e => handleChange('themeTitle', e.target.value)}
            className="text-center font-sans font-bold text-[55px] text-neutral-900 outline-none w-full bg-transparent placeholder-neutral-300 leading-none mt-10 transition-all hover:bg-neutral-50 focus:bg-white"
            placeholder="SPOOKY MYSTERIES"
          />
       </div>

       {/* Image Section */}
       <div 
          className={\`flex-1 w-full flex items-center justify-center my-6 relative group px-16 z-0 \${isDragging ? 'opacity-80' : ''}\`}
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
              <img src={parsedValue.image} alt="Cover graphic" className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-sm" />
              <button 
                onClick={() => handleChange('image', '')}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-red-50 text-neutral-600 hover:text-red-600 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={\`w-full h-full min-h-[300px] border-4 border-dashed \${isDragging ? 'border-purple-500 bg-purple-50' : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'} cursor-pointer rounded-2xl flex flex-col items-center justify-center transition-colors\`}
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
            className="text-center font-sans text-3xl tracking-[0.2em] text-neutral-800 outline-none w-full bg-transparent placeholder-neutral-300 transition-all hover:bg-neutral-50 focus:bg-white"
            placeholder="AUTHOR NAME"
          />
       </div>
    </div>
  )
};
`;

code = code.replace(regexCover, replaceCover);
fs.writeFileSync('src/BookFlow.tsx', code);
