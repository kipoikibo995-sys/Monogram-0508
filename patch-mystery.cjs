const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

const regexReplace = /case 'mystery':\s*return <TextPage value=\{data\.mystery\} onChange=\{\(v\) => handleUpdateData\('mystery', v\)\} placeholder="Instructions for marks, pattern mode, and pixel mode\.\.\." \/>;/;

const mysteryPage = `// --- MysteryPage Component ---
const MysteryPage = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
  let parsedValue = {
    title: 'Mystery #01',
    marks: [
      { mark: '•', code: '.', name: 'Dot', density: '75.4%' },
      { mark: '/', code: '1', name: 'Slash', density: '6.7%' },
      { mark: '\\\\', code: '2', name: 'Backslash', density: '2.3%' },
      { mark: '✕', code: '3', name: 'Cross', density: '1.3%' },
      { mark: '✱', code: '4', name: 'Asterisk', density: '8.5%' },
      { mark: '■', code: '5', name: 'Filled Square', density: '5.9%' }
    ]
  };

  try {
    if (value) {
      if (value.startsWith('{')) {
        parsedValue = { ...parsedValue, ...JSON.parse(value) };
      }
    }
  } catch(e) {}

  const handleChange = (key: string, val: any) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };

  const handleMarkChange = (index: number, field: string, val: string) => {
    const newMarks = [...parsedValue.marks];
    newMarks[index] = { ...newMarks[index], [field]: val };
    handleChange('marks', newMarks);
  };

  return (
    <div className="flex-1 w-full h-full bg-white flex flex-col items-center justify-center font-sans p-10 relative">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <input
          value={parsedValue.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="text-[48px] font-bold italic text-black outline-none w-full text-center bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors mb-16"
        />
        
        <div className="w-full flex flex-col">
          <div className="flex w-full items-center mb-4 font-bold text-black border-b border-neutral-100 pb-2">
            <div className="w-24 text-center">Mark</div>
            <div className="w-24 text-center">Code</div>
            <div className="flex-1">Name</div>
            <div className="w-32 text-right">Density %</div>
          </div>
          
          <div className="flex flex-col">
            {parsedValue.marks.map((row, i) => (
              <div key={i} className="flex w-full items-center py-3 border-b border-neutral-100 last:border-b-0">
                <div className="w-24 flex justify-center">
                  <div className="w-12 h-12 border border-black flex items-center justify-center text-3xl font-bold bg-white">
                    {row.mark === '■' ? <div className="w-6 h-6 bg-black"></div> : (
                      <input 
                        value={row.mark}
                        onChange={(e) => handleMarkChange(i, 'mark', e.target.value)}
                        className="w-full text-center outline-none bg-transparent"
                      />
                    )}
                  </div>
                </div>
                
                <div className="w-24 flex justify-center">
                  <input
                    value={row.code}
                    onChange={(e) => handleMarkChange(i, 'code', e.target.value)}
                    className="font-bold text-center text-[18px] text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded"
                  />
                </div>
                
                <div className="flex-1">
                  <input
                    value={row.name}
                    onChange={(e) => handleMarkChange(i, 'name', e.target.value)}
                    className="font-bold text-[18px] text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded"
                  />
                </div>
                
                <div className="w-32 flex justify-end">
                  <input
                    value={row.density}
                    onChange={(e) => handleMarkChange(i, 'density', e.target.value)}
                    className="font-bold text-[18px] text-black outline-none w-full text-right bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
`;

code = code.replace(regexReplace, "case 'mystery':\n        return <MysteryPage value={data.mystery} onChange={(v) => handleUpdateData('mystery', v)} />;\n");
code = code.replace('// --- TextPage Component ---', mysteryPage + '\n// --- TextPage Component ---');

fs.writeFileSync('src/BookFlow.tsx', code);
