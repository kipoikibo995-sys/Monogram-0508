const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importRegex = /import \{ AdminView \} from '\.\/components\/AdminView';/;
code = code.replace(importRegex, "import { SettingsView } from './components/SettingsView';\nimport { AdminView } from './components/AdminView';");

const stateBlockRegex = /  const \[isSettingsOpen, setIsSettingsOpen\] = useState\(false\);\n  const \[appSettings, setAppSettings\] = useState\(\{[\s\S]*?\}\);\n  const \[isSavingSettings, setIsSavingSettings\] = useState\(false\);\n  const \[saveSettingsMessage, setSaveSettingsMessage\] = useState\(''\);\n\n  useEffect\(\(\) => \{\n    const savedSettings = localStorage\.getItem\('kdp_monocrafter_settings'\);\n[\s\S]*?\}, \[\]\);\n\n  const handleSaveSettings = \(\) => \{\n[\s\S]*?  \};\n/;

code = code.replace(stateBlockRegex, `  const [isSettingsOpen, setIsSettingsOpen] = useState(false);\n  const [settingsTab, setSettingsTab] = useState<'account' | 'kdp' | 'editor'>('account');\n\n`);

const sidebarSettingsRegex = /<div className="flex flex-col gap-1">\n              <button \n                onClick=\{\(\) => setIsSettingsOpen\(!isSettingsOpen\)\}\n                className=\{`relative z-0 flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-semibold \$\{isSettingsOpen \? 'text-neutral-900 bg-neutral-50' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'\}`\}\n              >\n[\s\S]*?<\/AnimatePresence>\n            <\/div>/;

const newSidebarSettings = `<div className="flex flex-col gap-1">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={\`relative z-0 flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === 'settings' || isSettingsOpen ? 'text-neutral-900 bg-neutral-50' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}\`}
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
                    <div className="flex flex-col gap-1 pl-7 pr-2 py-1">
                      <button 
                        onClick={() => { setView('settings'); setSettingsTab('account'); }}
                        className={\`text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors \${view === 'settings' && settingsTab === 'account' ? 'text-black bg-neutral-200/50' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'}\`}
                      >
                        Account & Profile
                      </button>
                      <button 
                        onClick={() => { setView('settings'); setSettingsTab('kdp'); }}
                        className={\`text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors \${view === 'settings' && settingsTab === 'kdp' ? 'text-black bg-neutral-200/50' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'}\`}
                      >
                        KDP Defaults
                      </button>
                      <button 
                        onClick={() => { setView('settings'); setSettingsTab('editor'); }}
                        className={\`text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors \${view === 'settings' && settingsTab === 'editor' ? 'text-black bg-neutral-200/50' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'}\`}
                      >
                        Editor Preferences
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>`;

code = code.replace(sidebarSettingsRegex, newSidebarSettings);

const animatePresenceIndex = code.indexOf('<AnimatePresence mode="wait">');
const insertString = `          {view === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex overflow-hidden"
            >
              <SettingsView user={user} onLogout={() => signOut(auth)} activeTab={settingsTab} />
            </motion.div>
          )}\n`;

code = code.slice(0, animatePresenceIndex + 29) + '\n' + insertString + code.slice(animatePresenceIndex + 29);

fs.writeFileSync('src/App.tsx', code);
