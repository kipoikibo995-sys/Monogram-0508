const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldContainer = `
                  <div 
                    onClick={() => setSelectedIndex(i)}
                    className="relative shrink-0 transition-all duration-200 cursor-pointer rounded-sm"
                    style={{
                      width: \`\${850 * (zoom / 100)}px\`,
                      height: \`\${1100 * (zoom / 100)}px\`
                    }}
                  >
                    <div 
                      className="relative bg-white shadow-2xl transition-transform duration-200 print:shadow-none print:m-0 print:scale-100 origin-top-left"
                      style={{ 
                        width: '850px', 
                        height: '1100px',
                        transform: \`scale(\${zoom / 100})\`
                      }}
                    >
                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
                    
                    {/* Book Binding Crease Effect (left side since it's a right page typically) */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
                    
                    {/* Note: The canvas itself draws margins internally based on current grid, so we just pad the container to make it look like a page */}
                    <canvas 
                      ref={(el) => canvasRefs.current[i] = el} 
                      className={\`block w-full h-full object-contain relative z-10 \${activePaint?.imageIndex === i ? 'cursor-crosshair' : ''}\`}
                      onPointerDown={(e) => handlePointerDown(e, i)}
                      onPointerMove={(e) => handlePointerMove(e, i)}
                      onPointerUp={(e) => handlePointerUp(e, i)}
                      onPointerLeave={(e) => handlePointerUp(e, i)}
                    />
                  </div>
                </div>
`;

const newContainer = `
                  <div 
                    onClick={() => setSelectedIndex(i)}
                    className="relative shrink-0 transition-transform duration-200 cursor-pointer flex items-center justify-center max-w-full max-h-full"
                    style={{
                      transform: \`scale(\${zoom / 100})\`
                    }}
                  >
                    <canvas 
                      ref={(el) => canvasRefs.current[i] = el} 
                      className={\`block max-w-full max-h-full object-contain relative z-10 shadow-2xl bg-white \${activePaint?.imageIndex === i ? 'cursor-crosshair' : ''}\`}
                      style={{ width: 'auto', height: 'auto' }}
                      onPointerDown={(e) => handlePointerDown(e, i)}
                      onPointerMove={(e) => handlePointerMove(e, i)}
                      onPointerUp={(e) => handlePointerUp(e, i)}
                      onPointerLeave={(e) => handlePointerUp(e, i)}
                    />
                  </div>
`;

code = code.replace(oldContainer, newContainer);
fs.writeFileSync('src/App.tsx', code);
