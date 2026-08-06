const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove hardcoded 'pro' for the admin's userTier
code = code.replace(/const userTier = user\?\.email\?\.toLowerCase\(\) === 'kojiacademy2026@gmail\.com' \? 'pro' : userTierState;/g, "const userTier = userTierState;");

// Update the initial setUserTier before snapshot
code = code.replace(/setUserTier\(currentUser\?\.email\?\.toLowerCase\(\) === 'kojiacademy2026@gmail\.com' \? 'pro' : 'free'\);/g, "setUserTier('free');");

// Update the setUserTier inside onSnapshot
code = code.replace(/setUserTier\(\n\s*currentUser\.email\?\.toLowerCase\(\) === 'kojiacademy2026@gmail\.com' \n\s*\? 'pro' \n\s*: \(snap\.data\(\)\.tier \|\| 'free'\)\n\s*\);/g, "setUserTier(snap.data().tier || 'free');");

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed App.tsx hardcoded tier");
