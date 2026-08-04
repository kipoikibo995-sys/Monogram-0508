const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

code = code.replace(
  /const \[activeTab, setActiveTab\] = useState<'users' \| 'pending'>\('users'\);/,
  `const [activeTab, setActiveTab] = useState<'paid' | 'free' | 'pending'>('paid');`
);

code = code.replace(
  /const filteredUsers = users\.filter\(u => \n\s*u\.email\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\) \|\| \n\s*\(u\.displayName && u\.displayName\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)\)\n\s*\);/,
  `const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'paid') {
      return matchesSearch && (u.tier === 'pro' || u.tier === 'enterprise');
    } else if (activeTab === 'free') {
      return matchesSearch && u.tier === 'free';
    }
    return matchesSearch;
  });`
);

code = code.replace(
  /<button \n\s*onClick=\{([^}]+)\}setActiveTab\('users'\)([^>]+)>\n\s*Registered Users\n\s*<\/button>/,
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

code = code.replace(
  /\{activeTab === 'users' \? \(/,
  `{(activeTab === 'paid' || activeTab === 'free') ? (`
);

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log("Patched AdminView.tsx to add free/paid tabs");
