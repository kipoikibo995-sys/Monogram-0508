const fs = require('fs');

function patchFile(filepath) {
    let code = fs.readFileSync(filepath, 'utf8');
    
    // For single quotes
    code = code.replace(/'https:\/\/kojilaunch\.com\/monogram-version\/'/g, 
        `(userTier === 'free' ? 'https://kojilaunch.com/fe-monogram/' : 'https://kojilaunch.com/monogram-version/')`);
    
    // For double quotes
    code = code.replace(/"https:\/\/kojilaunch\.com\/monogram-version\/"/g, 
        `(userTier === 'free' ? 'https://kojilaunch.com/fe-monogram/' : 'https://kojilaunch.com/monogram-version/')`);
        
    // Specifically for href
    code = code.replace(/href=\(userTier === 'free' \? 'https:\/\/kojilaunch\.com\/fe-monogram\/' : 'https:\/\/kojilaunch\.com\/monogram-version\/'\)/g,
        `href={userTier === 'free' ? 'https://kojilaunch.com/fe-monogram/' : 'https://kojilaunch.com/monogram-version/'}`);
        
    fs.writeFileSync(filepath, code);
    console.log("Patched", filepath);
}

patchFile('src/App.tsx');
patchFile('src/BookFlow.tsx');
