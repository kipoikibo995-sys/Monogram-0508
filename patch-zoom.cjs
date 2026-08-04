const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the zoom scaling in the render loop to use width/height instead of transform.
const oldCanvasWrapper = `
                  <div 
                    onClick={() => setSelectedIndex(i)}
                    className="relative shrink-0 transition-transform duration-200 cursor-pointer flex items-center justify-center"
                    style={{
                      transform: \`scale(\${zoom / 100})\`
                    }}
                  >
                    <canvas 
                      ref={(el) => canvasRefs.current[i] = el} 
                      className={\`block relative z-10 shadow-2xl bg-white \${activePaint?.imageIndex === i ? 'cursor-crosshair' : ''}\`}
                      
                      onPointerDown={(e) => handlePointerDown(e, i)}
`;

const newCanvasWrapper = `
                  <div 
                    onClick={() => setSelectedIndex(i)}
                    className="relative shrink-0 transition-all duration-200 cursor-pointer flex items-center justify-center"
                  >
                    <canvas 
                      ref={(el) => canvasRefs.current[i] = el} 
                      className={\`block relative z-10 shadow-2xl bg-white transition-all duration-200 \${activePaint?.imageIndex === i ? 'cursor-crosshair' : ''}\`}
                      style={{
                        width: canvasRefs.current[i] ? \`\${(canvasRefs.current[i].width / (window.devicePixelRatio || 1)) * (zoom / 100)}px\` : 'auto',
                        height: canvasRefs.current[i] ? \`\${(canvasRefs.current[i].height / (window.devicePixelRatio || 1)) * (zoom / 100)}px\` : 'auto',
                      }}
                      onPointerDown={(e) => handlePointerDown(e, i)}
`;

code = code.replace(oldCanvasWrapper, newCanvasWrapper);

fs.writeFileSync('src/App.tsx', code);
