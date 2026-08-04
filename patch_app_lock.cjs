const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace "Create New Book" button onClick and add disabled state for free tier
code = code.replace(
  /<button \n\s*onClick=\{createNewProject\}\n\s*className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm"\n\s*>/g,
  `{userTier === 'free' ? (
                  <button 
                  disabled
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-300 text-neutral-500 rounded-md text-sm font-semibold cursor-not-allowed shadow-sm"
                >
                ) : (
                  <button 
                  onClick={createNewProject}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm"
                >
                )}`
);

code = code.replace(
  /<button \n\s*onClick=\{createNewProject\}\n\s*className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm"\n\s*>/g,
  `{userTier === 'free' ? (
                    <button 
                    disabled
                    className="flex items-center gap-2 px-6 py-2.5 bg-neutral-300 text-neutral-500 rounded-md text-sm font-semibold cursor-not-allowed shadow-sm"
                  >
                  ) : (
                    <button 
                    onClick={createNewProject}
                    className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm"
                  >
                  )}`
);


// Replace the grid of projects with a lock overlay if free tier
code = code.replace(
  `{projects.length === 0 ? (`,
  `{userTier === 'free' ? (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border border-neutral-200 shadow-sm mt-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-900/5 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-neutral-100 flex flex-col items-center">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                        <Lock size={32} className="text-neutral-900" />
                      </div>
                      <h3 className="text-xl font-black text-neutral-900 mb-2">Account Pending Verification</h3>
                      <p className="text-neutral-600 mb-6 text-sm">Your account is currently locked. If you recently purchased the software via WarriorPlus, please wait a few moments for the system to process your transaction and upgrade your account.</p>
                      
                      <div className="flex flex-col w-full gap-3">
                        <button 
                          onClick={() => window.location.reload()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-bold transition-colors"
                        >
                          Refresh Status
                        </button>
                        <a 
                          href="https://warriorplus.com"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-neutral-200 hover:border-neutral-900 text-neutral-900 rounded-lg text-sm font-bold transition-colors"
                        >
                          Purchase Access
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fake background to show what they are missing */}
                  <div className="opacity-30 blur-sm pointer-events-none w-full">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                       <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm h-24"></div>
                       <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm h-24"></div>
                       <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm h-24"></div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm h-64"></div>
                       <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm h-64"></div>
                       <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm h-64"></div>
                     </div>
                  </div>
                </div>
              ) : projects.length === 0 ? (`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for lockdown");
