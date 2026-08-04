const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    } else if (pixelShape === 'diamond') {
      ctx.moveTo(cx, y - size / 2);
      ctx.lineTo(x + size * 1.5 + 0.5, cy);
      ctx.lineTo(cx, y + size * 1.5 + 0.5);
      ctx.lineTo(x - size / 2 - 0.5, cy);
    } else if (pixelShape === 'hexagon') {
      ctx.moveTo(cx, y - size / 3);
      ctx.lineTo(x + size * 1.33 + 0.5, y + size / 6);
      ctx.lineTo(x + size * 1.33 + 0.5, y + size * 5 / 6 + 0.5);
      ctx.lineTo(cx, y + size * 1.33 + 0.5);
      ctx.lineTo(x - size * 0.33 - 0.5, y + size * 5 / 6 + 0.5);
      ctx.lineTo(x - size * 0.33 - 0.5, y + size / 6);
    }`;

const replacement = `    } else if (pixelShape === 'diamond') {
      ctx.moveTo(cx, y);
      ctx.lineTo(x + size, cy);
      ctx.lineTo(cx, y + size);
      ctx.lineTo(x, cy);
    } else if (pixelShape === 'hexagon') {
      ctx.moveTo(x + size * 0.25, y);
      ctx.lineTo(x + size * 0.75, y);
      ctx.lineTo(x + size, cy);
      ctx.lineTo(x + size * 0.75, y + size);
      ctx.lineTo(x + size * 0.25, y + size);
      ctx.lineTo(x, cy);
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed shapes');
