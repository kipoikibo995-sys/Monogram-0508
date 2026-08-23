const fs = require('fs');

let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');
code = code.replace(/<span className="font-bold text-black uppercase">{p\.itemName \|\| 'Unknown Item'}<\/span>/g,
    '<span className="font-bold text-black uppercase">{p.itemName || p.item || "Unknown Item"}</span>');

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log("Patched AdminView.tsx");
