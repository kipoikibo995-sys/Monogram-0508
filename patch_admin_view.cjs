const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

// Add PendingUpgrade interface
code = code.replace(
  "interface UserData {",
  `interface PendingUpgrade {
  id: string;
  email: string;
  action: string;
  itemName: string;
  txId: string;
  date: number;
}

interface UserData {`
);

// Add state variables
code = code.replace(
  "const [searchTerm, setSearchTerm] = useState('');",
  `const [searchTerm, setSearchTerm] = useState('');
  const [pendingUpgrades, setPendingUpgrades] = useState<PendingUpgrade[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'pending'>('users');`
);

// Fetch pending upgrades
code = code.replace(
  "const querySnapshot = await getDocs(collection(db, 'users'));",
  `const querySnapshot = await getDocs(collection(db, 'users'));
      const pendingSnapshot = await getDocs(collection(db, 'pending_upgrades'));
      const pendingData: PendingUpgrade[] = [];
      pendingSnapshot.forEach((doc) => {
        pendingData.push({ id: doc.id, ...doc.data() } as PendingUpgrade);
      });
      setPendingUpgrades(pendingData.sort((a, b) => b.date - a.date));`
);

// Add tabs and pending table
code = code.replace(
  "{/* Stats Row */}",
  `<div className="flex gap-4 border-b-2 border-black">
          <button 
            onClick={() => setActiveTab('users')}
            className={\`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors \${activeTab === 'users' ? 'bg-black text-white' : 'bg-white text-neutral-500 hover:text-black'}\`}
          >
            Registered Users
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={\`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors flex items-center gap-2 \${activeTab === 'pending' ? 'bg-black text-white' : 'bg-white text-neutral-500 hover:text-black'}\`}
          >
            Pending Upgrades {pendingUpgrades.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingUpgrades.length}</span>}
          </button>
        </div>
        {activeTab === 'users' ? (
          <>
        {/* Stats Row */}`
);

// Add Pending Upgrades Table and close the ternary
code = code.replace(
  "          </div>\n        )}\n      </div>\n    </div>\n  );\n}",
  `          </div>
        )}
        </>
        ) : (
          <div className="border-2 border-black">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black">Email (Not Registered Yet)</th>
                  <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black border-l border-white/20">Item</th>
                  <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black border-l border-white/20">Transaction ID</th>
                  <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black border-l border-white/20">Date</th>
                </tr>
              </thead>
              <tbody>
                {pendingUpgrades.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-black font-bold uppercase">No pending upgrades found.</td>
                  </tr>
                ) : pendingUpgrades.map((p, i) => (
                  <tr key={p.id} className={\`border-b border-black \${i % 2 === 0 ? 'bg-white' : 'bg-neutral-100'} hover:bg-neutral-200 transition-colors\`}>
                    <td className="py-4 px-4 align-top border-r border-black font-bold text-black">{p.email}</td>
                    <td className="py-4 px-4 align-top border-r border-black font-medium">{p.itemName}</td>
                    <td className="py-4 px-4 align-top border-r border-black font-mono text-sm">{p.txId}</td>
                    <td className="py-4 px-4 align-top text-sm">{formatDate(p.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}`
);

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log("Patched AdminView.tsx");
