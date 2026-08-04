const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  'export const CoverPage = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {',
  'export const CoverPage = ({ value, onChange, isExport }: { value?: string; onChange: (v: string) => void; isExport?: boolean }) => {'
);

const oldMode = `const [mode, setMode] = useState<'' | 'custom' | 'template'>(() => {
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
    return isExport ? 'custom' : ''; // Default to custom only if exporting
  });`;

code = code.replace(oldMode, newMode);

// We need to also conditionally hide the "Change Style" button during export?
code = code.replace(
  '<button onClick={() => setMode(\'\')} className="flex items-center gap-2 text-neutral-500 hover:text-black mb-6 font-semibold transition-colors">',
  '{!isExport && <button onClick={() => setMode(\'\')} className="flex items-center gap-2 text-neutral-500 hover:text-black mb-6 font-semibold transition-colors">'
);
code = code.replace(
  '<ArrowLeft size={16} /> Change Cover Style',
  '<ArrowLeft size={16} /> Change Cover Style\n            </button>}'
);

fs.writeFileSync('src/BookFlow.tsx', code);
