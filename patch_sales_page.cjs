const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /import \{ AuthPage \} from '\.\/components\/AuthPage';/,
  `import { AuthPage } from './components/AuthPage';\nimport { SalesPage } from './components/SalesPage';`
);

code = code.replace(
  /const \[saveStatus, setSaveStatus\] = useState<'idle' \| 'saving' \| 'saved'>\('idle'\);/,
  `const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');\n  const [showSalesPage, setShowSalesPage] = useState(true);`
);

code = code.replace(
  /if \(!user\) \{\n\s*return <AuthPage \/>;\n\s*\}/,
  `if (!user) {
    if (showSalesPage) {
      return <SalesPage onLoginClick={() => setShowSalesPage(false)} />;
    }
    return <AuthPage />;
  }`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx to include SalesPage");
