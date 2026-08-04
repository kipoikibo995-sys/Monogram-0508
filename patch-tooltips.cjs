const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "LayoutDashboard, Calendar, Clock } from 'lucide-react';",
  "LayoutDashboard, Calendar, Clock, HelpCircle } from 'lucide-react';"
);

const infoTooltipCode = `
function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative inline-flex items-center ml-1.5 group cursor-help z-50">
      <HelpCircle size={12} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-max max-w-[200px] bg-neutral-900 text-white text-[10px] px-2 py-1.5 rounded shadow-lg z-50 whitespace-normal leading-relaxed text-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-[4px] border-transparent border-t-neutral-900"></div>
      </div>
    </div>
  );
}
`;

code = code.replace(
  "function Slider({ label, value, min, max, onChange, step = 1 }: { label: string, value: number, min: number, max: number, onChange: (v: number) => void, step?: number }) {",
  infoTooltipCode + "\nfunction Slider({ label, value, min, max, onChange, step = 1, tooltip }: { label: string, value: number, min: number, max: number, onChange: (v: number) => void, step?: number, tooltip?: string }) {"
);

code = code.replace(
  '<label className="text-xs font-semibold text-neutral-700">{label}</label>',
  '<label className="text-xs font-semibold text-neutral-700 flex items-center">{label}{tooltip && <InfoTooltip text={tooltip} />}</label>'
);

code = code.replace(
  "function Toggle({ label, checked, onChange, description }: { label: string, checked: boolean, onChange: (c: boolean) => void, description?: string }) {",
  "function Toggle({ label, checked, onChange, description, tooltip }: { label: string, checked: boolean, onChange: (c: boolean) => void, description?: string, tooltip?: string }) {"
);

code = code.replace(
  '<span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-900 transition-colors">{label}</span>',
  '<span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-900 transition-colors flex items-center">{label}{tooltip && <InfoTooltip text={tooltip} />}</span>'
);

fs.writeFileSync('src/App.tsx', code);
