const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. imports
code = code.replace("Image as ImageIcon,", "Image as ImageIcon, FileText,");

// 2. state
const regexState = /const \[currentProject, setCurrentProject\] = useState<Project \| null>\(null\);/;
const replaceState = `const [currentProject, setCurrentProject] = useState<Project | null>(null);\n  const [activeBookFlowPage, setActiveBookFlowPage] = useState<'cover' | 'copyright' | 'welcome' | 'warmup' | 'pentesting' | 'mystery'>('cover');`;
code = code.replace(regexState, replaceState);

// 3. sidebar
const regexSidebar = /\{\(view === 'editor' \|\| view === 'bookflow'\) && currentProject && \([\s\S]*?<\/button>\s*\)\}/;
const replaceSidebar = `{(view === 'editor' || view === 'bookflow') && currentProject && (
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => setView('bookflow')}
                    className={\`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === 'bookflow' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}\`}
                  >
                    <BookText size={16} />
                    BookFlow
                  </button>
                  {view === 'bookflow' && (
                    <div className="flex flex-col gap-1 pl-7 pr-2 py-1">
                      {[
                        { id: 'cover', title: 'Cover Book', icon: <ImageIcon size={14} /> },
                        { id: 'copyright', title: 'Copyright Page', icon: <FileText size={14} /> },
                        { id: 'welcome', title: 'Welcome Page', icon: <FileText size={14} /> },
                        { id: 'warmup', title: 'Warm up practice', icon: <FileText size={14} /> },
                        { id: 'pentesting', title: 'Pen Testing lab', icon: <FileText size={14} /> },
                        { id: 'mystery', title: 'Mystery Instructions', icon: <FileText size={14} /> },
                      ].map(page => (
                        <button
                          key={page.id}
                          onClick={() => setActiveBookFlowPage(page.id as any)}
                          className={\`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-xs font-semibold \${
                            activeBookFlowPage === page.id 
                              ? 'bg-purple-100 text-purple-900 shadow-sm' 
                              : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                          }\`}
                        >
                          {page.icon}
                          <span className="truncate">{page.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}`;
code = code.replace(regexSidebar, replaceSidebar);

// 4. render
const regexRender = /<BookFlow project=\{currentProject\} onUpdateProject=\{[^\}]+\}\} \/>/;
const replaceRender = `<BookFlow project={currentProject} onUpdateProject={(p) => { setCurrentProject(p); setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)); }} activePage={activeBookFlowPage} />`;
code = code.replace(regexRender, replaceRender);

fs.writeFileSync('src/App.tsx', code);
