const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change exportScale default to 2
code = code.replace(
  "const [exportScale, setExportScale] = useState(4);",
  "const [exportScale, setExportScale] = useState(3);"
);

// Change JPEG quality for UI pages to 0.85
code = code.replace(
  "const dataUrl = canvas.toDataURL('image/jpeg', 1.0);",
  "const dataUrl = canvas.toDataURL('image/jpeg', 0.85);"
);

// Change JPEG quality for book pages to 0.85
code = code.replace(
  "exportCanvas.toDataURL('image/jpeg', 0.95)",
  "exportCanvas.toDataURL('image/jpeg', 0.85)"
);

fs.writeFileSync('src/App.tsx', code);
