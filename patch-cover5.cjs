const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  "import { Image as ImageIcon, FileText, Download, Upload, Type, Grid3X3, Trash2 } from 'lucide-react';",
  "import { Image as ImageIcon, FileText, Download, Upload, Type, Grid3X3, Trash2, ArrowLeft } from 'lucide-react';"
);

const regexCover = /\/\/ --- CoverPage Component ---\nconst CoverPage = \(\{ value, onChange \}: \{ value\?: string; onChange: \(v: string\) => void \}\) => \{[\s\S]*?\n\};\n/g;

const replaceCover = `// --- CoverPage Component ---
const CoverPage = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
  let parsedValue = {
    mode: '',
    topSubtitle: 'ONE COLOR COLORING BOOK',
    subtitle2: 'Color by Number',
    mainTitle: 'MONOCHROME',
    themeTitle: 'SPOOKY MYSTERIES',
    author: 'ALAN PARKER',
    images: [] as string[],
    templateImage: ''
  };

  try {
    if (value && value.startsWith('{')) {
      const parsed = JSON.parse(value);
      parsedValue = { ...parsedValue, ...parsed };
      if (!parsedValue.mode) {
         if (parsed.images && parsed.images.length > 0) {
           parsedValue.mode = 'custom';
         } else {
           parsedValue.mode = 'template';
           if (parsed.image) parsedValue.templateImage = parsed.image;
         }
      }
    } else if (value) {
      parsedValue.images = [value];
      parsedValue.mode = 'custom';
    }
  } catch (e) {}

  const handleChange = (key: string, val: any) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | File[], isTemplateMode: boolean) => {
    if (isTemplateMode) {
      const file = Array.from(files).find(f => f.type.startsWith('image/'));
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange('templateImage', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      const newImages = [...parsedValue.images];
      let added = 0;
      const remainingSlots = 4 - newImages.length;
      if (remainingSlots <= 0) return;

      const filesArray = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, remainingSlots);
      if (filesArray.length === 0) return;
      
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target?.result as string);
          added++;
          if (added === filesArray.length) {
            handleChange('images', newImages);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...parsedValue.images];
    newImages.splice(index, 1);
    handleChange('images', newImages);
  };

  if (!parsedValue.mode) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-white p-8">
        <h2 className="text-3xl font-bold text-neutral-800 mb-12">Choose Cover Style</h2>
        <div className="flex gap-8 w-full max-w-3xl">
           <button onClick={() => handleChange('mode', 'custom')} className="flex-1 p-10 border-2 border-neutral-200 rounded-3xl hover:border-neutral-900 hover:shadow-xl transition-all flex flex-col items-center text-center group cursor-pointer bg-neutral-50 hover:bg-white">
              <div className="w-20 h-20 bg-white shadow-sm border border-neutral-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-neutral-900 group-hover:text-white transition-colors text-neutral-600">
                 <ImageIcon size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-neutral-900">Upload Ready-made</h3>
              <p className="text-neutral-500 text-base leading-relaxed">Upload your own full cover design (up to 4 images).</p>
           </button>
           <button onClick={() => handleChange('mode', 'template')} className="flex-1 p-10 border-2 border-neutral-200 rounded-3xl hover:border-neutral-900 hover:shadow-xl transition-all flex flex-col items-center text-center group cursor-pointer bg-neutral-50 hover:bg-white">
              <div className="w-20 h-20 bg-white shadow-sm border border-neutral-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-neutral-900 group-hover:text-white transition-colors text-neutral-600">
                 <FileText size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-neutral-900">Use Demo Template</h3>
              <p className="text-neutral-500 text-base leading-relaxed">Use our built-in text template and upload a center graphic.</p>
           </button>
        </div>
      </div>
    );
  }

  if (parsedValue.mode === 'custom') {
    const imgCount = parsedValue.images.length;
    return (
      <div 
        className={\`flex-1 w-full h-full flex flex-col relative group bg-white \${isDragging ? 'opacity-80' : ''}\`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files, false);
        }}
      >
        <button 
           onClick={() => handleChange('mode', '')}
           className="absolute top-4 left-4 z-50 p-2 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-600 rounded-full shadow-md transition-all print:hidden"
           title="Change Cover Style"
        >
           <ArrowLeft size={20} />
        </button>

        {imgCount > 0 ? (
          <div className="flex-1 w-full h-full relative">
            <div className={\`w-full h-full grid gap-4 p-8 \${
              imgCount === 1 ? 'grid-cols-1 grid-rows-1' :
              imgCount === 2 ? 'grid-cols-1 grid-rows-2' :
              imgCount === 3 ? 'grid-cols-2 grid-rows-2' :
              'grid-cols-2 grid-rows-2'
            }\`}>
              {parsedValue.images.map((src, idx) => (
                <div key={idx} className={\`relative w-full h-full flex items-center justify-center bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200 shadow-sm \${imgCount === 3 && idx === 0 ? 'col-span-2' : ''}\`}>
                  <img src={src} alt={\`Cover \${idx}\`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-red-50 text-neutral-600 hover:text-red-600 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>
            
            {imgCount < 4 && (
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity print:hidden z-50">
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full shadow-xl font-medium"
                 >
                    <Upload size={18} /> Add Image ({imgCount}/4)
                 </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={\`w-full h-full border-4 border-dashed \${isDragging ? 'border-purple-500 bg-purple-50' : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'} cursor-pointer flex flex-col items-center justify-center transition-colors rounded-2xl p-8 text-center\`}
            >
              <Upload size={48} className={\`\${isDragging ? 'text-purple-500' : 'text-neutral-400'} mb-4\`} />
              <p className={\`\${isDragging ? 'text-purple-600' : 'text-neutral-700'} font-bold text-2xl mb-2\`}>
                {isDragging ? 'Drop images here' : 'Upload Custom Cover Images'}
              </p>
              <p className="text-neutral-500 text-base max-w-sm">
                Upload up to 4 images for your book cover.
              </p>
            </div>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files, false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-between h-full bg-white relative font-sans w-full p-2 overflow-hidden group/template">
       <button 
           onClick={() => handleChange('mode', '')}
           className="absolute top-4 left-4 z-50 p-2 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-600 rounded-full shadow-md transition-all opacity-0 group-hover/template:opacity-100 print:hidden"
           title="Change Cover Style"
        >
           <ArrowLeft size={20} />
       </button>

       {/* Top Section */}
       <div className="w-full flex flex-col items-center mt-2 relative z-10 px-4">
          <input 
            value={parsedValue.topSubtitle} 
            onChange={e => handleChange('topSubtitle', e.target.value)}
            className="text-center text-[24px] tracking-[0.05em] text-neutral-800 outline-none w-full min-w-0 bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 uppercase rounded-md transition-colors"
            placeholder="Top Subtitle"
          />
          
          <div className="flex items-center justify-center w-full mt-2">
            <input 
              value={parsedValue.subtitle2} 
              onChange={e => handleChange('subtitle2', e.target.value)}
              className="text-center font-black text-[56px] text-neutral-900 outline-none w-full min-w-0 bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 tracking-tighter rounded-md transition-colors"
              placeholder="Color by Number"
            />
          </div>

          <input 
            value={parsedValue.mainTitle} 
            onChange={e => handleChange('mainTitle', e.target.value)}
            className="text-center font-black text-[96px] text-neutral-900 outline-none w-full min-w-0 bg-transparent tracking-tighter leading-[0.9] hover:bg-neutral-100 focus:bg-neutral-50 -mt-2 rounded-md transition-colors"
            placeholder="MONOCHROME"
          />
          
          <input 
            value={parsedValue.themeTitle} 
            onChange={e => handleChange('themeTitle', e.target.value)}
            className="text-center font-bold text-[48px] text-neutral-900 outline-none w-full min-w-0 bg-transparent leading-none hover:bg-neutral-100 focus:bg-neutral-50 mt-1 rounded-md transition-colors"
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
            if (e.dataTransfer.files) handleFiles(e.dataTransfer.files, true);
          }}
       >
          {parsedValue.templateImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={parsedValue.templateImage} alt="Cover graphic" className="max-w-full max-h-full object-contain mix-blend-multiply" />
              <button 
                onClick={() => handleChange('templateImage', '')}
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
                {isDragging ? 'Drop image here' : 'Click to upload center graphic'}
              </p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files, true);
            }}
          />
       </div>

       {/* Bottom Section */}
       <div className="w-full mb-8 relative z-10 px-4">
          <input 
            value={parsedValue.author} 
            onChange={e => handleChange('author', e.target.value)}
            className="text-center text-[28px] tracking-[0.1em] text-neutral-800 outline-none w-full min-w-0 bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 uppercase rounded-md transition-colors"
            placeholder="AUTHOR NAME"
          />
       </div>
    </div>
  )
};
`;

code = code.replace(regexCover, replaceCover);
fs.writeFileSync('src/BookFlow.tsx', code);
