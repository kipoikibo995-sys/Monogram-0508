const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `  useEffect(() => {
    if (images.length === 0 || view !== 'editor') return;
    
    let tries = 0;
    let timeoutId = null;
    const checkAndRender = () => {
      // Check if ANY canvas ref is populated, not just the first one, because maybe they deleted the first one?
      // Actually canvasRefs.current is sparse if they deleted. Let's just check if any exists.
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
  }, [images, selectedIndex, view]);`
);

fs.writeFileSync('src/App.tsx', code);
