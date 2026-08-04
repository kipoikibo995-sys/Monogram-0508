const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(
  "className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-xs font-semibold ${",
  "className={`relative z-0 flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-xs font-semibold ${"
);

appCode = appCode.replace(
  `                            activeBookFlowPage === page.id 
                              ? 'bg-neutral-300 text-black shadow-sm' 
                              : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                          }\`}
                        >
                          {page.icon}`,
  `                            activeBookFlowPage === page.id 
                              ? 'text-black' 
                              : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                          }\`}
                        >
                          {activeBookFlowPage === page.id && (
                            <motion.div
                              layoutId="activeBookFlowPage"
                              className="absolute inset-0 bg-neutral-300 rounded-md -z-10 shadow-sm"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          {page.icon}`
);

appCode = appCode.replace(
  `              <button 
                onClick={() => setView('dashboard')}
                className={\`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === 'dashboard' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}\`}
              >`,
  `              <button 
                onClick={() => setView('dashboard')}
                className={\`relative z-0 flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === 'dashboard' ? 'text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}\`}
              >
                {view === 'dashboard' && (
                  <motion.div
                    layoutId="activeView"
                    className="absolute inset-0 bg-neutral-100 rounded-md -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}`
);

appCode = appCode.replace(
  `                  <button 
                    onClick={() => setView('bookflow')}
                    className={\`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === 'bookflow' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}\`}
                  >`,
  `                  <button 
                    onClick={() => setView('bookflow')}
                    className={\`relative z-0 flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === 'bookflow' ? 'text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}\`}
                  >
                    {view === 'bookflow' && (
                      <motion.div
                        layoutId="activeView"
                        className="absolute inset-0 bg-neutral-100 rounded-md -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}`
);

appCode = appCode.replace(
  `                  <button 
                    onClick={() => setView('editor')}
                    className={\`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === 'editor' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}\`}
                  >`,
  `                  <button 
                    onClick={() => setView('editor')}
                    className={\`relative z-0 flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === 'editor' ? 'text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}\`}
                  >
                    {view === 'editor' && (
                      <motion.div
                        layoutId="activeView"
                        className="absolute inset-0 bg-neutral-100 rounded-md -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}`
);


fs.writeFileSync('src/App.tsx', appCode);
console.log("App.tsx tab indicator updated");
