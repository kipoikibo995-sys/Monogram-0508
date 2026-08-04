const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `            renderArt(targetCanvas, images[idx].img, images[idx].settings, 1, undefined, false, true);
            prevSettingsRef.current[idx] = images[idx].settings;`,
  `            renderArt(targetCanvas, images[idx].img, images[idx].settings, 1, undefined, false, true);
            targetCanvas.style.width = \`\${(targetCanvas.width / (window.devicePixelRatio || 1)) * (zoomRef.current / 100)}px\`;
            targetCanvas.style.height = \`\${(targetCanvas.height / (window.devicePixelRatio || 1)) * (zoomRef.current / 100)}px\`;
            prevSettingsRef.current[idx] = images[idx].settings;`
);

fs.writeFileSync('src/App.tsx', code);
