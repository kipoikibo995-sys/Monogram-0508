const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('showWelcomeModal')) {
  // Add state
  code = code.replace(
    /const \[saveStatus, setSaveStatus\] = useState<'idle' \| 'saving' \| 'saved'>\('idle'\);/,
    `const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');\n  const [showWelcomeModal, setShowWelcomeModal] = useState(false);`
  );

  // Trigger modal
  code = code.replace(
    /await setDoc\(userRef, \{\n\s*uid: currentUser\.uid,/,
    `setShowWelcomeModal(true);\n             await setDoc(userRef, {\n               uid: currentUser.uid,`
  );

  // Add modal JSX
  const modalJSX = `
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-neutral-200 overflow-hidden"
          >
            <div className="bg-neutral-900 px-6 py-8 text-center text-white relative">
               <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={32} className="text-white" />
               </div>
               <h2 className="text-2xl font-black mb-2">Welcome to KDP MonoCrafter!</h2>
               <p className="text-white/80 font-medium">Your account has been successfully created.</p>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <Lock size={20} className="text-neutral-900" />
                   </div>
                   <div>
                      <h4 className="font-bold text-neutral-900">Account Status: {userTier === 'free' ? 'Pending / Free' : 'Pro'}</h4>
                      <p className="text-sm text-neutral-600 mt-1">
                        {userTier === 'free' 
                          ? 'If you purchased through WarriorPlus, please wait a few moments for the system to process your transaction and unlock your account. You can refresh the page to check your status.' 
                          : 'Your account is fully upgraded and ready to use.'}
                      </p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} className="text-neutral-900" />
                   </div>
                   <div>
                      <h4 className="font-bold text-neutral-900">Start Creating</h4>
                      <p className="text-sm text-neutral-600 mt-1">Once unlocked, you can create up to 100-page monochrome mystery books for KDP.</p>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold transition-colors"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        </div>
      )}
  `;

  // Find where to inject modal
  code = code.replace(
    /(<div className="flex h-screen bg-white text-neutral-900 overflow-hidden font-sans">)/,
    `$1\n${modalJSX}`
  );

  fs.writeFileSync('src/App.tsx', code);
  console.log("Added Welcome Modal");
} else {
  console.log("Welcome Modal already exists");
}
