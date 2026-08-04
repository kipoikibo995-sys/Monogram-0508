const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
/const newTier = 'pro'; \/\/ You can map itemName to specific tiers/g,
`let newTier = 'pro';
        // Map item names or numbers to specific tiers
        const itemNameLower = itemName ? itemName.toLowerCase() : '';
        if (itemNameLower.includes('enterprise') || itemNameLower.includes('oto')) {
          newTier = 'enterprise';
        }`
);

fs.writeFileSync('server.ts', code);
console.log("Patched IPN");
