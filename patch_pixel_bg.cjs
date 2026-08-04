const fs = require('fs');
let code = fs.readFileSync('src/components/SalesPage.tsx', 'utf8');

const pixelBgComp = `
const PixelBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.07]">
    {/* Grid */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}
    />
    
    {/* Tetris shapes */}
    {/* T-shape */}
    <div className="absolute top-24 left-10 flex flex-wrap" style={{ width: '96px' }}>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 opacity-0"></div>
      <div className="w-8 h-8 bg-black"></div>
    </div>
    
    {/* Square */}
    <div className="absolute top-64 right-20 flex flex-wrap" style={{ width: '64px' }}>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
    </div>

    {/* L-shape */}
    <div className="absolute bottom-40 left-[20%] flex flex-wrap" style={{ width: '64px' }}>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 opacity-0"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 opacity-0"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
    </div>
    
    {/* S-shape */}
    <div className="absolute top-32 right-[30%] flex flex-wrap" style={{ width: '96px' }}>
      <div className="w-8 h-8 opacity-0"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 opacity-0"></div>
    </div>
    
    {/* Line */}
    <div className="absolute top-[60%] right-[10%] flex flex-wrap" style={{ width: '32px' }}>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
    </div>
  </div>
);
`;

code = code.replace(
  /export function SalesPage/,
  pixelBgComp + '\nexport function SalesPage'
);

code = code.replace(
  /className="min-h-screen text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white relative"\n\s*style=\{\{\n\s*backgroundColor: '#fafafa',\n\s*backgroundImage: 'radial-gradient\(#d4d4d4 1px, transparent 1px\)',\n\s*backgroundSize: '24px 24px'\n\s*\}\}/,
  `className="min-h-screen text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white relative bg-[#fafafa]"`
);

code = code.replace(
  /<nav className="w-full px-6 py-4 flex items-center justify-between border-b border-neutral-200 bg-white\/80 backdrop-blur-md sticky top-0 z-50">/,
  `<PixelBackground />\n      {/* Navigation */}\n      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">`
);

fs.writeFileSync('src/components/SalesPage.tsx', code);
console.log("Patched SalesPage.tsx for pixel background");
