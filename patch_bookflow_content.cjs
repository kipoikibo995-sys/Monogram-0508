const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

const replacement = `  const renderContent = () => {
    let content = null;
    switch (activePage) {
      case 'cover':
        content = <CoverPage value={data.coverBook} onChange={(v) => handleUpdateData('coverBook', v)} />;
        break;
      case 'copyright':
        content = <CopyrightPage value={data.copyrightPage} onChange={(v) => handleUpdateData('copyrightPage', v)} />;
        break;
      case 'welcome':
        content = <WelcomePage value={data.welcomePage} onChange={(v) => handleUpdateData('welcomePage', v)} />;
        break;
      case 'mystery':
        content = <MysteryPage value={data.mystery} onChange={(v) => handleUpdateData('mystery', v)} />;
        break;
      case 'warmup':
        content = <TemplatePage title="Warm up practice" value={data.warmUpPractice} onChange={(v) => handleUpdateData('warmUpPractice', v)} type="warmup" />;
        break;
      case 'pentesting':
        content = <TemplatePage title="Pen Testing lab" value={data.penTestingLab} onChange={(v) => handleUpdateData('penTestingLab', v)} type="pentesting" />;
        break;
      case 'thankyou':
        content = <ThankYouPage value={data.thankyou} onChange={(v) => handleUpdateData('thankyou', v)} />;
        break;
      default:
        content = null;
    }

    const isLockedPage = activePage === 'warmup' || activePage === 'pentesting' || activePage === 'mystery';
    const showLock = isLockedPage && userTier === 'free';

    if (showLock) {
      return (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 z-0 opacity-40 blur-md pointer-events-none">
            {content}
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-auto">
            <div className="bg-white/80 p-8 rounded-2xl shadow-2xl backdrop-blur-sm flex flex-col items-center max-w-sm text-center">
              <Lock size={64} className="text-neutral-400 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Pro Feature</h3>
              <p className="text-neutral-600 mb-6 font-medium">This page is only available in the Pro version. Upgrade to edit and export this template.</p>
              <button 
                onClick={() => alert('Upgrade to Pro to unlock this feature!')}
                className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-neutral-800 transition-colors w-full"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      );
    }

    return content;
  };`;

code = code.replace(
  /const renderContent = \(\) => {[\s\S]*?};/,
  replacement
);

fs.writeFileSync('src/BookFlow.tsx', code);
