const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldCard = `<div 
                          key={p.id} 
                          onClick={() => openProject(p)}
                          className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col gap-4"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-500 group-hover:text-neutral-900 transition-colors">
                                <BookOpen size={20} />
                              </div>
                              <div className="flex flex-col">
                                <h4 className="font-bold text-neutral-900 truncate max-w-[140px]">{p.name}</h4>
                                <span className="text-xs text-neutral-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteProjectAction(p.id); }}
                              className="text-neutral-400 hover:text-black transition-colors p-1"
                              title="Delete book"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium shrink-0">
                              <ImageIcon size={14} />
                              {p.imageCount} {p.imageCount === 1 ? 'Image' : 'Images'}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setView('bookflow'); setCurrentProject(p); }}
                                className="text-[10px] font-bold text-neutral-700 hover:text-black bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 px-2 py-1 rounded transition-colors whitespace-nowrap"
                              >
                                BookFlow
                              </button>
                              <span className="text-xs font-semibold text-black whitespace-nowrap">Open &rarr;</span>
                            </div>
                          </div>
                        </div>`;

const newCard = `<div 
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
                        </div>`;

if (code.includes(oldCard)) {
  code = code.replace(oldCard, newCard);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Success");
} else {
  console.log("Could not find the old card to replace");
}
