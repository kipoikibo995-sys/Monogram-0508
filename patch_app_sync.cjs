const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
/await setDoc\(userRef, \{\n\s*uid: currentUser\.uid,\n\s*email: currentUser\.email,\n\s*displayName: currentUser\.displayName,\n\s*createdAt: Date\.now\(\),\n\s*lastLogin: Date\.now\(\),\n\s*status: 'active',\n\s*tier: 'free',\n\s*purchases: \[\]\n\s*\}\);\n\s*setUserTier\('free'\);/g,
`await setDoc(userRef, {
               uid: currentUser.uid,
               email: currentUser.email,
               displayName: currentUser.displayName,
               createdAt: Date.now(),
               lastLogin: Date.now(),
               status: 'active',
               tier: 'free',
               purchases: []
             });
             setUserTier('free');
             
             // Check for pending upgrades
             try {
                await fetch('/api/user/sync-upgrades', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ email: currentUser.email })
                });
             } catch(e) { console.error("Sync upgrades failed", e); }`
);

code = code.replace(
/await setDoc\(userRef, \{\n\s*lastLogin: Date\.now\(\),\n\s*email: currentUser\.email,\n\s*displayName: currentUser\.displayName\n\s*\}, \{ merge: true \}\);/g,
`await setDoc(userRef, {
               lastLogin: Date.now(),
               email: currentUser.email,
               displayName: currentUser.displayName
             }, { merge: true });
             
             // Check for pending upgrades
             try {
                await fetch('/api/user/sync-upgrades', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ email: currentUser.email })
                });
             } catch(e) { console.error("Sync upgrades failed", e); }`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for sync");
