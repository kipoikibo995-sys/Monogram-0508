const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Replace both instances of page scaling
code = code.replace(/const svgW = gridCols \* cSize \+ margin \* 2 \+ coordOffset \* 2;[\s\S]*?<Page key=\{i\} size=\{\[pageW, pageH\]\} style=\{\{ backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' \}\}>[\s\S]*?<View style=\{\{ width: svgW, height: svgH \}\}>[\s\S]*?<Svg width=\{svgW\} height=\{svgH\} viewBox=\{\`0 0 \$\{svgW\} \$\{svgH\}\`\}>/g,
  (match) => {
    return `const contentW = gridCols * cSize + coordOffset;
        const contentH = gridRows * cSize + coordOffset;
        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;
        
        // Calculate the scale needed to fit the content within maxW/maxH
        const scale = Math.min(maxW / contentW, maxH / contentH);
        
        // Final dimensions to center properly
        const finalW = contentW * scale;
        const finalH = contentH * scale;

        return (
          <Page key={i} size={[pageW, pageH]} style={{ backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: finalW, height: finalH }}>
              <Svg width={finalW} height={finalH} viewBox={\`0 0 \${contentW} \${contentH}\`}>`;
  }
);

// We need to fix the offset of the grid.
// Previously the grid was shifted by margin + coordOffset.
// Now the viewbox is from 0 0 to contentW contentH.
// So the grid should be shifted by just coordOffset.
code = code.replace(/<G x=\{margin \+ coordOffset\} y=\{margin \+ coordOffset\}>/g, '<G x={coordOffset} y={coordOffset}>');

// We also need to fix the coordinates text position.
// Previously x was margin + coordOffset + x * cSize + cSize / 2
// Now it's coordOffset + x * cSize + cSize / 2
code = code.replace(/x=\{margin \+ coordOffset \+ x \* cSize \+ cSize \/ 2\} y=\{margin \+ coordOffset \/ 2\}/g, 'x={coordOffset + x * cSize + cSize / 2} y={coordOffset / 2}');
code = code.replace(/x=\{margin \+ coordOffset \/ 2\} y=\{margin \+ coordOffset \+ y \* cSize \+ cSize \/ 2\}/g, 'x={coordOffset / 2} y={coordOffset + y * cSize + cSize / 2}');

fs.writeFileSync('src/PdfExport.tsx', code);
