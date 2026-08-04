const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `<button onClick={() => { 
                      setIsExportMenuOpen(false); 
                      if (userTier === 'free') { alert("SVG Export is a Pro feature. Please upgrade."); return; }
                      handleDownloadSVG(); 
                    }} className="w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors hover:bg-neutral-50 hover:text-neutral-900 text-neutral-700">
                    <div className="flex items-center gap-2"><Download size={14} /> Export SVG</div>
                    {userTier === 'free' && <Lock size={12} className="text-neutral-400" />}
                  </button>`,
  `<button onClick={() => { setIsExportMenuOpen(false); handleDownloadSVG(); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                    <Download size={14} /> Export SVG
                  </button>`
);

code = code.replace(
  `<button onClick={() => { 
                      setIsExportMenuOpen(false); 
                      if (userTier === 'free') { alert("PNG Export is a Pro feature. Please upgrade."); return; }
                      handleDownload(); 
                    }} className="w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors hover:bg-neutral-50 hover:text-neutral-900 text-neutral-700">
                    <div className="flex items-center gap-2"><Download size={14} /> Export PNG</div>
                    {userTier === 'free' && <Lock size={12} className="text-neutral-400" />}
                  </button>`,
  `<button onClick={() => { setIsExportMenuOpen(false); handleDownload(); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                    <Download size={14} /> Export PNG
                  </button>`
);

fs.writeFileSync('src/App.tsx', code);
