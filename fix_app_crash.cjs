const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /setUserTier\(currentUser\.email\?\.toLowerCase\(\) === 'kojiacademy2026@gmail\.com' \? 'enterprise' : 'free'\);/g,
  `setUserTier(currentUser?.email?.toLowerCase() === 'kojiacademy2026@gmail.com' ? 'enterprise' : 'free');`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed currentUser crash");
