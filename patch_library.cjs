const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldGrid = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.map(p => (
                        <div 
                          key={p.id} 
                          onClick={() => openProject(p)}
                          className="relative bg-white rounded-r-xl rounded-l-md border border-neutral-200 shadow-[4px_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[12px_12px_24px_rgba(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col overflow-hidden min-h-[160px] transform hover:-translate-y-1"
                        >
                          {/* Book Spine */}
                          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-neutral-200 to-neutral-50 border-r border-neutral-200/50 z-10 shadow-[inset_-1px_0_2px_rgba(0,0,0,0.05)]"></div>
                          {/* Pages detail */}
                          <div className="absolute right-0 top-1 bottom-1 w-1 bg-gradient-to-l from-neutral-200/50 to-transparent border-l border-neutral-100/50 rounded-r-sm z-0"></div>
                          
                          <div className="pl-8 pr-5 pt-5 pb-4 flex flex-col h-full justify-between relative z-10 bg-gradient-to-br from-white to-neutral-50/30 h-full">
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col gap-1.5">
                                <h4 className="font-bold text-neutral-900 text-lg leading-tight line-clamp-2 pr-2">{p.name}</h4>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteProjectAction(p.id); }}
                                className="text-neutral-300 hover:text-red-500 transition-colors p-1 -mr-2"
                                title="Delete book"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 mt-auto">
                              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium shrink-0">
                                <ImageIcon size={14} />
                                {p.imageCount} {p.imageCount === 1 ? 'Page' : 'Pages'}
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setView('bookflow'); setCurrentProject(p); }}
                                  className="text-[10px] font-bold text-neutral-700 hover:text-black bg-white border border-neutral-200 shadow-sm hover:shadow px-2.5 py-1 rounded-md transition-all whitespace-nowrap"
                                >
                                  BookFlow
                                </button>
                                <span className="text-xs font-semibold text-black whitespace-nowrap ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>`;

const newGrid = `<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      <button 
                        onClick={createNewProject}
                        className="bg-white border-2 border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center gap-4 transition-all hover:bg-neutral-50 hover:border-neutral-300 group min-h-[280px]"
                      >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100 group-hover:scale-110 transition-transform">
                          <Plus size={24} className="text-neutral-400" />
                        </div>
                        <span className="text-[11px] font-bold tracking-widest text-neutral-500">NEW BOOK</span>
                      </button>
                      
                      {projects.map(p => (
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
                      ))}
                    </div>`;

if (code.includes(oldGrid)) {
  code = code.replace(oldGrid, newGrid);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Success");
} else {
  console.log("Could not find old grid");
}
