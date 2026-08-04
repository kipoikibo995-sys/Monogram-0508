const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// First replace the first loop's condition
code = code.replace(
  /if \(isExportingSolutions \|\| settings\.viewMode === 'solution'\) \{/g,
  "if (isExportingSolutions) {"
);

// We need to fix the shape rendering in both loops. Let's just do a big replace.
// Loop 1 rendering:
code = code.replace(
  /if \(isExportingSolutions\) \{\s+if \(settings\.renderStyle === 'pixels'\) \{[\s\S]*?\} else \{\s+\/\/ Workbook Mode/g,
  `if (isExportingSolutions) {
                      if (settings.renderStyle === 'pixels') {
                        const shades = ['#ffffff', '#e5e5e5', '#cccccc', '#999999', '#666666', '#333333', '#000000'];
                        return (
                          <G key={elKey}>
                            <Rect x={px} y={py} width={cSize} height={cSize} fill={shades[shapeIndex]} stroke="none" />
                            <Rect x={px} y={py} width={cSize} height={cSize} fill="none" stroke="#999999" strokeWidth={Math.max(1, cSize * 0.04)} />
                          </G>
                        );
                      } else {
                        let shapeEl = null;
                        if (shapeIndex === 1) shapeEl = <Circle cx={cx} cy={cy} r={Math.max(1, inkThickness * 1.5)} fill={inkColor} />;
                        if (shapeIndex === 2) shapeEl = <Line x1={px} y1={py + cSize} x2={px + cSize} y2={py} stroke={inkColor} strokeWidth={inkThickness} />;
                        if (shapeIndex === 3) shapeEl = <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />;
                        if (shapeIndex === 4) shapeEl = (
                          <G>
                            <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px + cSize} y1={py} x2={px} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                          </G>
                        );
                        if (shapeIndex === 5) shapeEl = (
                          <G>
                            <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px + cSize} y1={py} x2={px} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={cx} y1={py} x2={cx} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px} y1={cy} x2={px + cSize} y2={cy} stroke={inkColor} strokeWidth={inkThickness} />
                          </G>
                        );
                        if (shapeIndex === 6) shapeEl = <Rect x={px} y={py} width={cSize + 0.5} height={cSize + 0.5} fill={inkColor} />;
                        
                        return (
                          <G key={elKey}>
                            <Rect x={px} y={py} width={cSize} height={cSize} fill="none" stroke="#999999" strokeWidth={Math.max(1, cSize * 0.04)} />
                            {shapeEl}
                          </G>
                        );
                      }
                    } else {
                      // Workbook Mode`
);

// Loop 2 rendering:
code = code.replace(
  /if \(true\) \{\s+if \(settings\.renderStyle === 'pixels'\) \{[\s\S]*?\} else \{\s+\/\/ Workbook Mode/g,
  `if (true) {
                      if (settings.renderStyle === 'pixels') {
                        const shades = ['#ffffff', '#e5e5e5', '#cccccc', '#999999', '#666666', '#333333', '#000000'];
                        return (
                          <G key={elKey}>
                            <Rect x={px} y={py} width={cSize} height={cSize} fill={shades[shapeIndex]} stroke="none" />
                            <Rect x={px} y={py} width={cSize} height={cSize} fill="none" stroke="#999999" strokeWidth={Math.max(1, cSize * 0.04)} />
                          </G>
                        );
                      } else {
                        let shapeEl = null;
                        if (shapeIndex === 1) shapeEl = <Circle cx={cx} cy={cy} r={Math.max(1, inkThickness * 1.5)} fill={inkColor} />;
                        if (shapeIndex === 2) shapeEl = <Line x1={px} y1={py + cSize} x2={px + cSize} y2={py} stroke={inkColor} strokeWidth={inkThickness} />;
                        if (shapeIndex === 3) shapeEl = <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />;
                        if (shapeIndex === 4) shapeEl = (
                          <G>
                            <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px + cSize} y1={py} x2={px} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                          </G>
                        );
                        if (shapeIndex === 5) shapeEl = (
                          <G>
                            <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px + cSize} y1={py} x2={px} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={cx} y1={py} x2={cx} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px} y1={cy} x2={px + cSize} y2={cy} stroke={inkColor} strokeWidth={inkThickness} />
                          </G>
                        );
                        if (shapeIndex === 6) shapeEl = <Rect x={px} y={py} width={cSize + 0.5} height={cSize + 0.5} fill={inkColor} />;
                        
                        return (
                          <G key={elKey}>
                            <Rect x={px} y={py} width={cSize} height={cSize} fill="none" stroke="#999999" strokeWidth={Math.max(1, cSize * 0.04)} />
                            {shapeEl}
                          </G>
                        );
                      }
                    } else {
                      // Workbook Mode`
);

fs.writeFileSync('src/PdfExport.tsx', code);
