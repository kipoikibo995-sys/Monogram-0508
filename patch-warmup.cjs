const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

const regexReplace = /\/\/ --- TemplatePage Component ---\nconst TemplatePage = \(\{ title, value, onChange, type \}: \{ title: string; value\?: string; onChange: \(v: string\) => void; type: 'warmup' \| 'pentesting' \}\) => \{[\s\S]*?\n\};\n/g;

const templatePage = `// --- TemplatePage Component ---
const TemplatePage = ({ title, value, onChange, type }: { title: string; value?: string; onChange: (v: string) => void; type: 'warmup' | 'pentesting' }) => {
  let parsedValue: any = {};
  if (type === 'warmup') {
    parsedValue = {
      title: 'WARM UP PRACTICE',
      subtitle: 'Hone your pen strokes by practicing each code in the cells below\\nbefore starting the puzzle.',
      levels: [
        { label: 'LEVEL 0: DOT', desc: 'Practice drawing "Center Dot only" in these cells:', hint: '•' },
        { label: 'LEVEL 1: SLASH', desc: 'Practice drawing "Single slash (/)" in these cells:', hint: '1' },
        { label: 'LEVEL 2: BACKSLASH', desc: 'Practice drawing "Single backslash (\\\\)" in these cells:', hint: '2' },
        { label: 'LEVEL 3: X', desc: 'Practice drawing "Cross mark (X)" in these cells:', hint: '3' },
        { label: 'LEVEL 4: ASTERISK', desc: 'Practice drawing "Asterisk(*)" in these cells:', hint: '4' },
        { label: 'LEVEL 5: FILLED SQUARE', desc: 'Practice drawing "Solid black square" in these cells:', hint: '5' }
      ]
    };
  } else {
    parsedValue = { title: 'Pen Testing lab' };
  }

  try {
    if (value) {
      if (value.startsWith('{')) {
        parsedValue = { ...parsedValue, ...JSON.parse(value) };
      }
    }
  } catch (e) {}

  const handleChange = (key: string, val: any) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };

  const handleLevelChange = (index: number, field: string, val: string) => {
    if (!parsedValue.levels) return;
    const newLevels = [...parsedValue.levels];
    newLevels[index] = { ...newLevels[index], [field]: val };
    handleChange('levels', newLevels);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col font-sans p-10 bg-white relative">
      {type === 'warmup' && (
        <div className="flex flex-col flex-1">
          <input
            value={parsedValue.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="text-[32px] font-bold text-center text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors uppercase mb-4"
          />
          
          <textarea
            value={parsedValue.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="w-full resize-none text-center outline-none bg-transparent text-[20px] leading-[1.5] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black"
            rows={2}
          />
          
          <div className="w-full h-[1px] bg-neutral-300 my-6"></div>
          
          <div className="flex flex-col flex-1 gap-6">
            {parsedValue.levels?.map((lvl: any, i: number) => (
              <div key={i} className="flex flex-col">
                <input
                  value={lvl.label}
                  onChange={(e) => handleLevelChange(i, 'label', e.target.value)}
                  className="font-bold text-[16px] uppercase text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors mb-0.5"
                />
                <input
                  value={lvl.desc}
                  onChange={(e) => handleLevelChange(i, 'desc', e.target.value)}
                  className="text-[15px] text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors mb-3"
                />
                <div className="flex gap-4">
                  {Array.from({ length: 10 }).map((_, col) => (
                    <div key={col} className="w-12 h-12 border border-neutral-400 flex items-center justify-center text-neutral-300 text-xl">
                      {lvl.hint}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'pentesting' && (
        <div className="flex flex-col flex-1">
          <input
            value={parsedValue.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="text-[32px] font-bold text-center text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors uppercase mb-12"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-2 border-neutral-300 rounded-lg flex flex-col h-32 bg-neutral-50/50">
                <div className="border-b-2 border-neutral-300 p-2 text-center text-xs font-semibold text-neutral-500 uppercase tracking-widest bg-neutral-100/50 rounded-t-lg">
                  Pen #{i + 1}
                </div>
                <div className="flex-1 p-2">
                  {/* Empty area for swatching */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
`

code = code.replace(regexReplace, templatePage);
fs.writeFileSync('src/BookFlow.tsx', code);
