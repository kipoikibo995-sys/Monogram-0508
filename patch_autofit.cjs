const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const fitFn = `
  const fitToScreen = () => {
    const availableWidth = window.innerWidth - 288;
    const availableHeight = window.innerHeight - 128;
    // Calculate best scale based on first canvas
    let bestScale = 1;
    const firstCanvas = canvasRefs.current[0];
    if (firstCanvas) {
      const canvasW = firstCanvas.width / (window.devicePixelRatio || 1);
      const canvasH = firstCanvas.height / (window.devicePixelRatio || 1);
      const scaleW = availableWidth / canvasW;
      const scaleH = availableHeight / canvasH;
      bestScale = Math.max(0.1, Math.min(scaleW, scaleH));
    } else {
      bestScale = Math.max(0.1, Math.min(availableWidth / 850, availableHeight / 1100));
    }
    setZoom(Math.floor(bestScale * 100));
  };
`;

code = code.replace(
  `  const [zoom, setZoom] = useState(100);`,
  `  const [zoom, setZoom] = useState(100);\n${fitFn}\n`
);

code = code.replace(
  `  useEffect(() => {
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
  }, [images, selectedIndex, view]);`,
  `  useEffect(() => {
    if (images.length === 0 || view !== 'editor') return;
    
    let tries = 0;
    let timeoutId = null;
    const checkAndRender = () => {
      const hasCanvas = canvasRefs.current.some(c => c !== null && c !== undefined);
      if (hasCanvas) {
        scheduleRender();
        setTimeout(fitToScreen, 100); // Auto fit when canvases are ready
      } else if (tries < 20) {
        tries++;
        timeoutId = setTimeout(checkAndRender, 50);
      }
    };
    
    timeoutId = setTimeout(checkAndRender, 50);
    return () => clearTimeout(timeoutId);
  }, [images, selectedIndex, view]);
  
  // Also auto-fit on window resize
  useEffect(() => {
    if (view === 'editor' && images.length > 0) {
      const handleResize = () => fitToScreen();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [view, images.length]);`
);

code = code.replace(
  `                onClick={() => {
                  const availableWidth = window.innerWidth - 288;
                  const availableHeight = window.innerHeight - 128;
                  // Calculate best scale based on first canvas
                  let bestScale = 1;
                  const firstCanvas = canvasRefs.current[0];
                  if (firstCanvas) {
                    const canvasW = firstCanvas.width / (window.devicePixelRatio || 1);
                    const canvasH = firstCanvas.height / (window.devicePixelRatio || 1);
                    const scaleW = availableWidth / canvasW;
                    const scaleH = availableHeight / canvasH;
                    bestScale = Math.max(0.1, Math.min(scaleW, scaleH));
                  } else {
                    bestScale = Math.max(0.1, Math.min(availableWidth / 850, availableHeight / 1100));
                  }
                  setZoom(Math.floor(bestScale * 100));
                }}`,
  `                onClick={fitToScreen}`
);

fs.writeFileSync('src/App.tsx', code);
