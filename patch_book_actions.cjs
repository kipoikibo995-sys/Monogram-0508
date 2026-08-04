const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStr = `{/* Hover Overlay for Actions */}
                          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all z-30 pointer-events-none group-hover:pointer-events-auto">
                             <button 
                                onClick={(e) => { e.stopPropagation(); setView('bookflow'); setCurrentProject(p); }}
                                className="px-6 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:scale-105 transition-transform"
                             >
                               BookFlow
                             </button>
                             <button 
                                onClick={(e) => { e.stopPropagation(); openProject(p); }}
                                className="px-6 py-2 border border-white text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-white hover:text-black transition-all"
                             >
                               Open Editor
                             </button>
                          </div>

                          {/* Progress Footer */}
                          <div className="px-5 pb-5 pt-3 border-t border-white/5 relative z-20 bg-[#111111]">
                            <div className="flex justify-between items-center text-[9px] font-bold tracking-widest text-white/40 mb-2">
                              <span>{p.imageCount}/{p.imageCount} PAGES</span>
                              <span>100%</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-[#7a705b] w-full"></div>
                            </div>
                          </div>`;

const newStr = `{/* Hover Overlay for Actions */}
                          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all z-30 pointer-events-none group-hover:pointer-events-auto p-4">
                             <button 
                                onClick={(e) => { e.stopPropagation(); setView('bookflow'); setCurrentProject(p); }}
                                className="w-2/3 max-w-[120px] py-2 bg-white text-black font-bold text-[10px] uppercase tracking-wider rounded hover:scale-105 transition-transform"
                             >
                               BookFlow
                             </button>
                             <button 
                                onClick={(e) => { e.stopPropagation(); openProject(p); }}
                                className="w-2/3 max-w-[120px] py-2 border border-white/50 text-white font-bold text-[10px] uppercase tracking-wider rounded hover:bg-white hover:text-black hover:border-white transition-all"
                             >
                               Open Editor
                             </button>
                          </div>

                          {/* Progress Footer */}
                          <div className="px-5 pb-5 pt-3 border-t border-white/5 relative z-20 bg-[#111111]">
                            <div className="flex justify-center items-center text-[9px] font-bold tracking-widest text-white/40">
                              <span>{p.imageCount} {p.imageCount === 1 ? 'PAGE' : 'PAGES'}</span>
                            </div>
                          </div>`;

if (code.includes(oldStr)) {
  code = code.replace(oldStr, newStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Success");
} else {
  console.log("Not found");
}
