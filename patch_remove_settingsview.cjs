const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importRegex = /import \{ SettingsView \} from '\.\/components\/SettingsView';\n/;
code = code.replace(importRegex, '');

const jsxRegex = /          \{view === "settings" && \(\n            <motion\.div\n              key="settings"\n              initial=\{\{ opacity: 0, y: 10 \}\}\n              animate=\{\{ opacity: 1, y: 0 \}\}\n              exit=\{\{ opacity: 0, y: -10 \}\}\n              transition=\{\{ duration: 0\.2 \}\}\n              className="flex-1 flex overflow-hidden"\n            >\n              <SettingsView user=\{user\} onLogout=\{\(\) => signOut\(auth\)\} \/>\n            <\/motion\.div>\n          \)\}\n/;
code = code.replace(jsxRegex, '');

fs.writeFileSync('src/App.tsx', code);
