const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

const oldMode = "const [mode, setMode] = useState<'' | 'custom' | 'template'>('');";
const newMode = `const [mode, setMode] = useState<'' | 'custom' | 'template'>(() => {
    try {
      if (value && value.startsWith('{')) {
         const parsed = JSON.parse(value);
         if (parsed.templateImage) return 'template';
         if (parsed.images && parsed.images.length > 0) return 'custom';
      } else if (value) {
         return 'custom';
      }
    } catch(e) {}
    return 'custom'; // Default to custom if empty so export renders something
  });`;

code = code.replace(oldMode, newMode);

fs.writeFileSync('src/BookFlow.tsx', code);
