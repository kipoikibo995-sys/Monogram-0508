const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const stateBlock = `  const [view, setView] = useState<'dashboard' | 'editor' | 'bookflow' | 'settings' | 'tutorial' | 'admin'>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appSettings, setAppSettings] = useState({
    authorName: '',
    defaultTrimSize: '8.5x11',
    defaultRenderStyle: 'shapes',
    defaultGridDensity: 60,
    language: 'en'
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSettingsMessage, setSaveSettingsMessage] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('kdp_monocrafter_settings');
    if (savedSettings) {
      try {
        setAppSettings({ 
          authorName: '',
          defaultTrimSize: '8.5x11',
          defaultRenderStyle: 'shapes',
          defaultGridDensity: 60,
          language: 'en',
          ...JSON.parse(savedSettings) 
        });
      } catch (e) {}
    }
  }, []);

  const handleSaveSettings = () => {
    setIsSavingSettings(true);
    localStorage.setItem('kdp_monocrafter_settings', JSON.stringify(appSettings));
    setTimeout(() => {
      setIsSavingSettings(false);
      setSaveSettingsMessage('Saved!');
      setTimeout(() => setSaveSettingsMessage(''), 2000);
    }, 400);
  };`;

code = code.replace(
  `  const [view, setView] = useState<'dashboard' | 'editor' | 'bookflow' | 'settings' | 'tutorial' | 'admin'>('dashboard');`,
  stateBlock
);

fs.writeFileSync('src/App.tsx', code);
