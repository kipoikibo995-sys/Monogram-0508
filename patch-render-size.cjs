const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldRenderCode = `
    targetCanvas.width = canvasLogicalWidth * dpr;
    targetCanvas.height = canvasLogicalHeight * dpr;
    
    const ctx = targetCanvas.getContext('2d');
`;

const newRenderCode = `
    targetCanvas.width = canvasLogicalWidth * dpr;
    targetCanvas.height = canvasLogicalHeight * dpr;
    targetCanvas.style.width = canvasLogicalWidth + 'px';
    targetCanvas.style.height = canvasLogicalHeight + 'px';
    
    const ctx = targetCanvas.getContext('2d');
`;

code = code.replace(oldRenderCode, newRenderCode);
fs.writeFileSync('src/App.tsx', code);
