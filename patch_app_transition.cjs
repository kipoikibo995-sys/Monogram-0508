const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  if (!user) {
    if (showSalesPage) {
      return <SalesPage onLoginClick={() => setShowSalesPage(false)} />;
    }
    return <AuthPage />;
  }`;

const replacement = `  if (!user) {
    return (
      <AnimatePresence mode="wait">
        {showSalesPage ? (
          <motion.div
            key="sales"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full min-h-screen"
          >
            <SalesPage onLoginClick={() => setShowSalesPage(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full min-h-screen"
          >
            <AuthPage />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('App.tsx transition patched');
} else {
  console.log('Target not found in App.tsx');
}
