const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/let newTier = 'pro';/g, "let newTier = 'regular';");
code = code.replace(/if \(itemNameLower\.includes\('enterprise'\) || itemNameLower\.includes\('oto'\)\) \{/g, "if (itemNameLower.includes('pro') || itemNameLower.includes('oto') || itemNameLower.includes('enterprise')) {");
code = code.replace(/newTier = 'enterprise';/g, "newTier = 'pro';");

code = code.replace(/let upgradeTo = 'pro';/g, "let upgradeTo = 'regular';");
code = code.replace(/if \(upgradeTo === 'enterprise'\) newTier = 'enterprise';/g, "if (upgradeTo === 'pro') newTier = 'pro';");
code = code.replace(/else if \(upgradeTo === 'pro' && newTier === 'free'\) newTier = 'pro';/g, "else if (upgradeTo === 'regular' && newTier === 'free') newTier = 'regular';");
code = code.replace(/if \(userTier === 'pro' || userTier === 'enterprise'\) \{/g, "if (userTier === 'regular' || userTier === 'pro') {");

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts for tiers");
