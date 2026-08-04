const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Import AdminView
code = code.replace("import { TutorialView } from './components/TutorialView';", "import { TutorialView } from './components/TutorialView';\nimport { AdminView } from './components/AdminView';");

// 2. Add 'admin' to view state
code = code.replace("useState<'dashboard' | 'editor' | 'bookflow' | 'settings' | 'tutorial'>('dashboard')", "useState<'dashboard' | 'editor' | 'bookflow' | 'settings' | 'tutorial' | 'admin'>('dashboard')");

// 3. Add lucide icon if missing, add Shield
if (!code.includes('Shield,')) {
    code = code.replace("import { BookText, Settings,", "import { BookText, Settings, Shield,");
}

// 4. Add Admin button in sidebar
const adminButton = `
            {user?.email === 'kojiacademy2026@gmail.com' && (
            <button 
              onClick={() => setView("admin")}
              className={\`relative z-0 flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold \${view === "admin" ? "text-neutral-900" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"}\`}
            >
              {view === "admin" && (
                <motion.div
                  layoutId="activeView"
                  className="absolute inset-0 bg-neutral-100 rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Shield size={16} />
              Admin
            </button>
            )}
`;
code = code.replace("onClick={() => setView(\"settings\")}", adminButton + "\n            <button \n              onClick={() => setView(\"settings\")}");

// 5. Add AdminView to AnimatePresence
const adminViewComponent = `
          {view === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex overflow-hidden"
            >
              <AdminView />
            </motion.div>
          )}
`;
code = code.replace("{view === 'dashboard' && (", adminViewComponent + "          {view === 'dashboard' && (");

fs.writeFileSync('src/App.tsx', code);
