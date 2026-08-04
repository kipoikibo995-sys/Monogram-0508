const fs = require('fs');
let code = fs.readFileSync('src/components/SalesPage.tsx', 'utf8');

// Remove pricing section
code = code.replace(
  /\{\/\* Pricing \/ CTA \*\/\}.*?<\/section>/s,
  ''
);

// Update Footer
code = code.replace(
  /© \{new Date\(\)\.getFullYear\(\)\} KDP MonoCrafter\. All rights reserved\./,
  'Copyright by KoJi Academy'
);

// Remove links to #pricing in Nav
code = code.replace(
  /<a \n\s*href="#pricing"\n\s*className="px-5 py-2 text-sm font-bold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors hidden sm:block"\n\s*>\n\s*Get Access\n\s*<\/a>/,
  ''
);

// Update hero Get Instant Access to just call onLoginClick or remove it. 
// Let's remove the "Get Instant Access" button and just keep "I already have an account" or rename it.
// Actually, I'll change the Get Instant Access button to point to onLoginClick.
code = code.replace(
  /<a \n\s*href="#pricing"\n\s*className="flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95"\n\s*>\n\s*Get Instant Access <ArrowRight size=\{20\} \/>\n\s*<\/a>/,
  `<button \n            onClick={onLoginClick}\n            className="flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95"\n          >\n            Get Started <ArrowRight size={20} />\n          </button>`
);

code = code.replace(
  /<button \n\s*onClick=\{onLoginClick\}\n\s*className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-neutral-900 border-2 border-neutral-200 rounded-xl font-bold text-lg hover:border-neutral-900 transition-all"\n\s*>\n\s*I already have an account\n\s*<\/button>/,
  `` // Just remove the second button to keep it clean if we changed the first one to Get Started.
);

fs.writeFileSync('src/components/SalesPage.tsx', code);
console.log("Patched SalesPage.tsx to remove pricing and update copyright");
