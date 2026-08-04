const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add zoomRef right after setZoom
const zoomState = "const [zoom, setZoom] = useState(100);";
const zoomRefCode = "const [zoom, setZoom] = useState(100);\n  const zoomRef = useRef(zoom);\n  useEffect(() => { zoomRef.current = zoom; }, [zoom]);";
code = code.replace(zoomState, zoomRefCode);

// Fix renderArt
const oldRenderStyles = `
    targetCanvas.width = canvasLogicalWidth * dpr;
    targetCanvas.height = canvasLogicalHeight * dpr;
    targetCanvas.style.width = canvasLogicalWidth + 'px';
    targetCanvas.style.height = canvasLogicalHeight + 'px';
`;
const newRenderStyles = `
    targetCanvas.width = canvasLogicalWidth * dpr;
    targetCanvas.height = canvasLogicalHeight * dpr;
    if (applyDpr) {
      targetCanvas.style.width = (canvasLogicalWidth * (zoomRef.current / 100)) + 'px';
      targetCanvas.style.height = (canvasLogicalHeight * (zoomRef.current / 100)) + 'px';
    } else {
      targetCanvas.style.width = canvasLogicalWidth + 'px';
      targetCanvas.style.height = canvasLogicalHeight + 'px';
    }
`;
code = code.replace(oldRenderStyles, newRenderStyles);

// We also need to fix the canvas inline style that we put in JSX earlier!
const oldCanvasInlineStyle = /style={{\s+width: canvasRefs\.current\[i\] \? `\$\{\(canvasRefs\.current\[i\]\.width \/ \(window\.devicePixelRatio \|\| 1\)\) \* \(zoom \/ 100\)\}px` : 'auto',\s+height: canvasRefs\.current\[i\] \? `\$\{\(canvasRefs\.current\[i\]\.height \/ \(window\.devicePixelRatio \|\| 1\)\) \* \(zoom \/ 100\)\}px` : 'auto',\s+}}/g;
const newCanvasInlineStyle = `style={{
                        width: canvasRefs.current[i] ? \`\${(canvasRefs.current[i].width / (window.devicePixelRatio || 1)) * (zoom / 100)}px\` : 'auto',
                        height: canvasRefs.current[i] ? \`\${(canvasRefs.current[i].height / (window.devicePixelRatio || 1)) * (zoom / 100)}px\` : 'auto',
                      }}`;
// Wait, actually since React re-renders when zoom changes, the style prop will correctly apply the zoom to the canvas!
// We just need to make sure we don't break the regex replacement if it's already exactly like that.

fs.writeFileSync('src/App.tsx', code);
