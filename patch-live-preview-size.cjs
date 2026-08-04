const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                    className="relative shrink-0 transition-transform duration-200 cursor-pointer flex items-center justify-center max-w-full max-h-full"`;
const newStr = `                    className="relative shrink-0 transition-transform duration-200 cursor-pointer flex items-center justify-center"`;

code = code.replace(targetStr, newStr);

const targetCanvasClass = "className={`block max-w-full max-h-full object-contain relative z-10 shadow-2xl bg-white ${activePaint?.imageIndex === i ? 'cursor-crosshair' : ''}`}";
const newCanvasClass = "className={`block relative z-10 shadow-2xl bg-white ${activePaint?.imageIndex === i ? 'cursor-crosshair' : ''}`}";

code = code.replace(targetCanvasClass, newCanvasClass);

// Instead of setting css width/height based on refs (which can cause re-render issues), we just remove the style attribute or set it to width: 'auto' so the canvas natural dimensions are used. But wait, canvas CSS width/height might default to its attributes. Let's just remove the style prop.
const targetCanvasStyle = `style={{ width: 'auto', height: 'auto' }}`;
const newCanvasStyle = `style={{ width: canvasRefs.current[i] ? Math.floor(canvasRefs.current[i].width / (window.devicePixelRatio || 1)) + 'px' : 'auto', height: canvasRefs.current[i] ? Math.floor(canvasRefs.current[i].height / (window.devicePixelRatio || 1)) + 'px' : 'auto' }}`;

code = code.replace(targetCanvasStyle, newCanvasStyle);

fs.writeFileSync('src/App.tsx', code);
