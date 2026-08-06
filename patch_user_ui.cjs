const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('Crown')) {
  code = code.replace(/User, Lock \} from 'lucide-react'/, "User, Lock, Crown, ArrowUpCircle } from 'lucide-react'");
}

const replacement = `
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-neutral-300" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 border border-neutral-300">
                      <User size={16} />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-neutral-900 truncate">{user.displayName || user.email}</span>
                    <div className="flex items-center gap-1">
                      {user.email === 'kojiacademy2026@gmail.com' ? (
                        <span className="text-[10px] font-bold text-blue-600 uppercase">Admin</span>
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-500 uppercase">{userTier === 'free' ? 'Free Plan' : userTier === 'regular' ? 'Regular Plan' : 'Pro Plan'}</span>
                      )}
                      {userTier !== 'free' && <Crown size={12} className="text-amber-500" />}
                    </div>
                  </div>
                </div>
                
                {userTier !== 'pro' && (
                  <button 
                    onClick={() => window.open('https://warriorplus.com', '_blank')}
                    className="w-full mt-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 shadow-sm transition-all"
                  >
                    <ArrowUpCircle size={14} /> Upgrade Now
                  </button>
                )}
                
                <button 
                  onClick={() => signOut(auth)}
                  className="w-full flex items-center justify-center gap-2 py-1.5 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:text-red-600 transition-colors"
                >
                  <LogOut size={14} /> Log Out
                </button>
`;

code = code.replace(
  /<div className="flex items-center gap-2">\n\s*\{user\.photoURL \? \([\s\S]*?<LogOut size=\{14\} \/> Log Out\n\s*<\/button>/,
  replacement.trim()
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched user ui");
