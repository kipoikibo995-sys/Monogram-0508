const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<button 
              onClick={() => setView("settings")}
              className={\`relative z-0 flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === "settings" ? "text-neutral-900" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"}\`}
            >
              {view === "settings" && (
                <motion.div
                  layoutId="activeView"
                  className="absolute inset-0 bg-neutral-100 rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Settings size={16} />
              Settings
            </button>`;

const replacement = `<div className="flex flex-col gap-1">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={\`relative z-0 flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-semibold \${isSettingsOpen ? 'text-neutral-900 bg-neutral-50' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}\`}
              >
                <div className="flex items-center gap-2">
                  <Settings size={16} />
                  Settings
                </div>
                <ChevronDown size={14} className={\`transition-transform \${isSettingsOpen ? 'rotate-180' : ''}\`} />
              </button>
              
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-3 pl-3 pr-2 py-2 border-l-2 border-neutral-100 ml-4 mb-2">
                       <div className="flex flex-col gap-2">
                         <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Default Author</label>
                         <input 
                           type="text" 
                           value={appSettings.authorName}
                           onChange={(e) => setAppSettings({...appSettings, authorName: e.target.value})}
                           placeholder="e.g. John Doe"
                           className="w-full px-2 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-neutral-400"
                         />
                       </div>
                       
                       <div className="flex flex-col gap-1">
                         <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Trim Size</label>
                         <div className="grid grid-cols-3 gap-1 mt-1">
                           {['8.5x11', '6x9', '8.5x8.5'].map(size => (
                             <button
                               key={size}
                               onClick={() => setAppSettings({...appSettings, defaultTrimSize: size as any})}
                               className={\`py-1 text-[10px] font-semibold rounded \${appSettings.defaultTrimSize === size ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}\`}
                             >
                               {size}
                             </button>
                           ))}
                         </div>
                       </div>
                       
                       <div className="flex flex-col gap-1">
                         <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Render Style</label>
                         <div className="grid grid-cols-2 gap-1 mt-1">
                           <button
                             onClick={() => setAppSettings({...appSettings, defaultRenderStyle: 'shapes'})}
                             className={\`py-1 text-[10px] font-semibold rounded \${appSettings.defaultRenderStyle === 'shapes' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}\`}
                           >
                             Pattern
                           </button>
                           <button
                             onClick={() => setAppSettings({...appSettings, defaultRenderStyle: 'pixels'})}
                             className={\`py-1 text-[10px] font-semibold rounded \${appSettings.defaultRenderStyle === 'pixels' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}\`}
                           >
                             Pixel
                           </button>
                         </div>
                       </div>
                       
                       <div className="flex flex-col gap-1">
                         <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Grid Density</label>
                         <div className="flex items-center gap-2 mt-1">
                           <input 
                             type="range" min="20" max="150" step="10"
                             value={appSettings.defaultGridDensity}
                             onChange={(e) => setAppSettings({...appSettings, defaultGridDensity: parseInt(e.target.value)})}
                             className="flex-1 accent-neutral-900 h-1"
                           />
                           <span className="text-[10px] font-bold w-6 text-center">{appSettings.defaultGridDensity}</span>
                         </div>
                       </div>
                       
                       <button 
                         onClick={handleSaveSettings}
                         disabled={isSavingSettings}
                         className="mt-2 w-full flex items-center justify-center gap-2 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-md transition-colors"
                       >
                         <Save size={12} />
                         {isSavingSettings ? 'Saving...' : saveSettingsMessage ? saveSettingsMessage : 'Save'}
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code);
