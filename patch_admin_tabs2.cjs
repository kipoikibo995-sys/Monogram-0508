const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

if (code.includes("Registered Users")) {
code = code.replace(
  /<button[\s\S]*?setActiveTab\('users'\)[\s\S]*?Registered Users\s*<\/button>/,
  `
          <button 
            onClick={() => setActiveTab('paid')}
            className={\`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors \${activeTab === 'paid' ? 'bg-black text-white' : 'bg-white text-neutral-500 hover:text-black'}\`}
          >
            Paid Users
          </button>
          <button 
            onClick={() => setActiveTab('free')}
            className={\`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors \${activeTab === 'free' ? 'bg-black text-white' : 'bg-white text-neutral-500 hover:text-black'}\`}
          >
            Free / Locked
          </button>
  `
);
}

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log("Patched AdminView.tsx to add free/paid tabs pt2");
