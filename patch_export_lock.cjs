const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `<button onClick={() => { setIsExportMenuOpen(false); handleDownloadSVG(); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                    <Download size={14} /> Export SVG
                  </button>`,
  `<button onClick={() => { 
                      setIsExportMenuOpen(false); 
                      if (userTier === 'free') { alert("SVG Export is a Pro feature. Please upgrade."); return; }
                      handleDownloadSVG(); 
                    }} className="w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors hover:bg-neutral-50 hover:text-neutral-900 text-neutral-700">
                    <div className="flex items-center gap-2"><Download size={14} /> Export SVG</div>
                    {userTier === 'free' && <Lock size={12} className="text-neutral-400" />}
                  </button>`
);

code = code.replace(
  `<button onClick={() => { setIsExportMenuOpen(false); handleDownload(); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                    <Download size={14} /> Export PNG
                  </button>`,
  `<button onClick={() => { 
                      setIsExportMenuOpen(false); 
                      if (userTier === 'free') { alert("PNG Export is a Pro feature. Please upgrade."); return; }
                      handleDownload(); 
                    }} className="w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors hover:bg-neutral-50 hover:text-neutral-900 text-neutral-700">
                    <div className="flex items-center gap-2"><Download size={14} /> Export PNG</div>
                    {userTier === 'free' && <Lock size={12} className="text-neutral-400" />}
                  </button>`
);

code = code.replace(
  `<button onClick={() => { setIsExportMenuOpen(false); handleBulkExportSVG(); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors border-t border-neutral-100 mt-1">
                        <Download size={14} /> Export SVG (ZIP)
                      </button>`,
  `<button onClick={() => { 
                        setIsExportMenuOpen(false); 
                        if (userTier === 'free') { alert("SVG Export (ZIP) is a Pro feature. Please upgrade."); return; }
                        handleBulkExportSVG(); 
                      }} className="w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors border-t border-neutral-100 mt-1 hover:bg-neutral-50 hover:text-neutral-900 text-neutral-700">
                        <div className="flex items-center gap-2"><Download size={14} /> Export SVG (ZIP)</div>
                        {userTier === 'free' && <Lock size={12} className="text-neutral-400" />}
                      </button>`
);

code = code.replace(
  `<button onClick={() => { setIsExportMenuOpen(false); handleBulkExportPNG(); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors mt-1">
                        <Download size={14} /> Export PNG (ZIP)
                      </button>`,
  `<button onClick={() => { 
                        setIsExportMenuOpen(false); 
                        if (userTier === 'free') { alert("PNG Export (ZIP) is a Pro feature. Please upgrade."); return; }
                        handleBulkExportPNG(); 
                      }} className="w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors mt-1 hover:bg-neutral-50 hover:text-neutral-900 text-neutral-700">
                        <div className="flex items-center gap-2"><Download size={14} /> Export PNG (ZIP)</div>
                        {userTier === 'free' && <Lock size={12} className="text-neutral-400" />}
                      </button>`
);

fs.writeFileSync('src/App.tsx', code);
