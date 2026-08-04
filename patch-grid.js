const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    if (showBgGrid && currentViewMode === 'solution') {
      if (renderStyle === 'pixels') {
        if (settings.pixelShape === 'square' || !settings.pixelShape) {
          ctx.strokeStyle = '#cccccc';
          ctx.lineWidth = Math.max(1, scaleMultiplier * 0.5);
          ctx.beginPath();
          for (let y = 0; y <= gridRows; y++) {
            ctx.moveTo(0, y * actualCellSize);
            ctx.lineTo(gridCols * actualCellSize, y * actualCellSize);
          }
          for (let x = 0; x <= gridCols; x++) {
            ctx.moveTo(x * actualCellSize, 0);
            ctx.lineTo(x * actualCellSize, gridRows * actualCellSize);
          }
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = inkColor === '#000000' ? '#999999' : inkColor;
        const dotRadius = Math.max(1 * scaleMultiplier, actualCellSize / 16);
        for (let y = 0; y <= gridRows; y++) {
          for (let x = 0; x <= gridCols; x++) {
            ctx.beginPath();
            ctx.arc(x * actualCellSize, y * actualCellSize, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }`;

const replacement = `    if (showBgGrid && currentViewMode === 'solution') {
      if (renderStyle === 'pixels') {
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = Math.max(1, scaleMultiplier * 0.5);
        ctx.beginPath();
        for (let y = 0; y <= gridRows; y++) {
          ctx.moveTo(0, y * actualCellSize);
          ctx.lineTo(gridCols * actualCellSize, y * actualCellSize);
        }
        for (let x = 0; x <= gridCols; x++) {
          ctx.moveTo(x * actualCellSize, 0);
          ctx.lineTo(x * actualCellSize, gridRows * actualCellSize);
        }
        ctx.stroke();
      } else {
        ctx.fillStyle = inkColor === '#000000' ? '#999999' : inkColor;
        const dotRadius = Math.max(1 * scaleMultiplier, actualCellSize / 16);
        for (let y = 0; y <= gridRows; y++) {
          for (let x = 0; x <= gridCols; x++) {
            ctx.beginPath();
            ctx.arc(x * actualCellSize, y * actualCellSize, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed grid');
