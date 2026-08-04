const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldPaintCell = `
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    
    const availableW = 850 - 72; 
    const availableH = 1100 - 72;
    const scale = Math.min(availableW / cw, availableH / ch);
    
    const renderedW = cw * scale;
    const renderedH = ch * scale;
    
    const emptyX = (availableW - renderedW) / 2;
    const emptyY = (availableH - renderedH) / 2;
    
    const xInsideCanvas = e.nativeEvent.offsetX - 36 - emptyX;
    const yInsideCanvas = e.nativeEvent.offsetY - 36 - emptyY;
    
    const px = xInsideCanvas / scale;
    const py = yInsideCanvas / scale;
`;

const newPaintCell = `
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = canvas.width / (window.devicePixelRatio || 1) / rect.width;
    const scaleY = canvas.height / (window.devicePixelRatio || 1) / rect.height;
    
    const px = x * scaleX;
    const py = y * scaleY;
`;

code = code.replace(oldPaintCell, newPaintCell);
fs.writeFileSync('src/App.tsx', code);
