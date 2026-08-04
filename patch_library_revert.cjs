const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHeader = `<div className="flex flex-col gap-10 mt-6">
                    <div className="flex flex-col items-center justify-center text-center gap-6">
                      <h3 className="text-5xl md:text-6xl text-neutral-900 leading-tight" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}>
                        Your<br/>Library
                      </h3>
                      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-600">SAVED BOOKS</span>
                    </div>`;

const newHeader = `<div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-neutral-900">Your Books</h3>`;

if (code.includes(oldHeader)) {
  code = code.replace(oldHeader, newHeader);
}

const oldBook = `{projects.map(p => (
                        <div 
                          key={p.id} 
                          onClick={() => openProject(p)}
                          className="relative bg-[#111111] rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col min-h-[280px] overflow-hidden"
                        >
                          {/* Book Spine highlight */}
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-white/10 to-transparent z-10 pointer-events-none"></div>
                          <div className="absolute left-2 top-0 bottom-0 w-px bg-white/5 z-10 pointer-events-none"></div>
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-10 pointer-events-none"></div>
                          
                          {/* Delete button (on hover) */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteProjectAction(p.id); }}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-30"
                            title="Delete book"
                          >
                            <Trash2 size={14} />
                          </button>

                          {/* Book Cover Content */}
                          <div className="flex flex-col h-full items-center justify-center text-center p-6 flex-1 relative z-20">
                            <h4 className="font-serif text-xl text-white/90 leading-snug line-clamp-3 mb-4" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}>{p.name}</h4>
                            <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">{(user?.displayName || 'AUTHOR').split(' ')[0]}</span>
                          </div>
                          
                          {/* Progress Footer */}
                          <div className="px-5 pb-5 pt-3 border-t border-white/5 relative z-20">
                            <div className="flex justify-between items-center text-[9px] font-bold tracking-widest text-white/40 mb-2">
                              <span>{p.imageCount}/{p.imageCount} PAGES</span>
                              <span>100%</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-[#7a705b] w-full"></div>
                            </div>
                          </div>
                        </div>
                      ))}`;

const newBook = `{projects.map(p => (
                        <div 
                          key={p.id} 
                          className="relative bg-[#111111] rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col min-h-[280px] overflow-hidden"
                        >
                          {/* Book Spine highlight */}
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-white/10 to-transparent z-10 pointer-events-none"></div>
                          <div className="absolute left-2 top-0 bottom-0 w-px bg-white/5 z-10 pointer-events-none"></div>
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-10 pointer-events-none"></div>
                          
                          {/* Delete button (on hover) */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteProjectAction(p.id); }}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-40"
                            title="Delete book"
                          >
                            <Trash2 size={14} />
                          </button>

                          {/* Book Cover Content */}
                          <div onClick={() => openProject(p)} className="cursor-pointer flex flex-col h-full items-center justify-center text-center p-6 flex-1 relative z-20">
                            <h4 className="font-serif text-xl text-white/90 leading-snug line-clamp-3 mb-4" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}>{p.name}</h4>
                            <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">{(user?.displayName || 'AUTHOR').split(' ')[0]}</span>
                          </div>
                          
                          {/* Hover Overlay for Actions */}
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
                          </div>
                        </div>
                      ))}`;

if (code.includes(oldBook)) {
  code = code.replace(oldBook, newBook);
}

fs.writeFileSync('src/App.tsx', code);
