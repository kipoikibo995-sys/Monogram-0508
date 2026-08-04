const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const \[userTier, setUserTier\] = useState<'free' \| 'pro' \| 'enterprise'>\('free'\);/,
  `const [userTierState, setUserTier] = useState<'free' | 'pro' | 'enterprise'>('free');\n  const userTier = user?.email?.toLowerCase() === 'kojiacademy2026@gmail.com' ? 'enterprise' : userTierState;`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed admin tier override in App.tsx");
