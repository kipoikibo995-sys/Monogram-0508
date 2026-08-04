const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `  useEffect(() => {
    if (images.length === 0 || view !== 'editor') return;
    
    // Force re-render of all canvases when returning to the editor view
    // because the canvas elements were destroyed and recreated, losing their pixel data.
    prevSettingsRef.current = [];
    
    let tries = 0;
    let timeoutId = null;
    const checkAndRender = () => {
      const hasCanvas = canvasRefs.current.some(c => c !== null && c !== undefined);
      if (hasCanvas) {
        scheduleRender();
      } else if (tries < 20) {
        tries++;
        timeoutId = setTimeout(checkAndRender, 50);
      }
    };
    
    timeoutId = setTimeout(checkAndRender, 50);
    return () => clearTimeout(timeoutId);
  }, [images, selectedIndex, view]);`,
  `  useEffect(() => {
    if (view === 'editor') {
      prevSettingsRef.current = [];
    }
  }, [view]);

  useEffect(() => {
    if (images.length === 0 || view !== 'editor') return;
    
    let tries = 0;
    let timeoutId = null;
    const checkAndRender = () => {
      const hasCanvas = canvasRefs.current.some(c => c !== null && c !== undefined);
      if (hasCanvas) {
        scheduleRender();
      } else if (tries < 20) {
        tries++;
        timeoutId = setTimeout(checkAndRender, 50);
      }
    };
    
    timeoutId = setTimeout(checkAndRender, 50);
    return () => clearTimeout(timeoutId);
  }, [images, selectedIndex, view]);`
);

fs.writeFileSync('src/App.tsx', code);
