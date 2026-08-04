const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `  useEffect(() => {
    if (images.length === 0) return;
    const timeoutId = setTimeout(scheduleRender, 150); // Small debounce
    return () => clearTimeout(timeoutId);
  }, [images, selectedIndex]);`,
  `  useEffect(() => {
    if (images.length === 0) return;
    
    // We need to wait for the canvas elements to mount if the view just changed
    const checkAndRender = () => {
      if (view === 'editor' && canvasRefs.current[0]) {
        scheduleRender();
      } else {
        setTimeout(checkAndRender, 50);
      }
    };
    
    const timeoutId = setTimeout(checkAndRender, 150);
    return () => clearTimeout(timeoutId);
  }, [images, selectedIndex, view]);`
);

fs.writeFileSync('src/App.tsx', code);
