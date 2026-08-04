const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
/tier: 'free',/g,
`tier: currentUser.email?.toLowerCase() === 'kojiacademy2026@gmail.com' ? 'enterprise' : 'free',`
);

code = code.replace(
/setUserTier\('free'\);/g,
`setUserTier(currentUser.email?.toLowerCase() === 'kojiacademy2026@gmail.com' ? 'enterprise' : 'free');`
);

code = code.replace(
/setUserTier\(snap\.data\(\)\.tier \|\| 'free'\);/g,
`setUserTier(
                  currentUser.email?.toLowerCase() === 'kojiacademy2026@gmail.com' 
                    ? 'enterprise' 
                    : (snap.data().tier || 'free')
                );`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched admin tier");
