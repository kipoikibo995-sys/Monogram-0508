const fs = require('fs');

// 1. Update ProcessedImage type
let content = fs.readFileSync('src/PdfExport.tsx', 'utf8');

content = content.replace(
`export type ProcessedImage = {
  gridCols: number;
  gridRows: number;
  cells: { x: number; y: number; shapeIndex: number; code: string }[];
  settings: ImageSettings;
};`,
`export type ProcessedImage = {
  gridCols: number;
  gridRows: number;
  cells: { x: number; y: number; shapeIndex: number; code: string }[];
  settings: ImageSettings;
  workbookDataUrl?: string;
  solutionDataUrl?: string;
};`
);

// 2. Update loop 1 (Workbook or standalone Solutions)
// Instead of drawing Svg, we draw PdfImage if dataUrl is present.
content = content.replace(
`              <Svg width={finalW} height={finalH} viewBox={\`0 0 \${contentW} \${contentH}\`}>`,
`              {(isExportingSolutions ? img.solutionDataUrl : img.workbookDataUrl) ? (
                <PdfImage src={(isExportingSolutions ? img.solutionDataUrl : img.workbookDataUrl)!} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Svg width={finalW} height={finalH} viewBox={\`0 0 \${contentW} \${contentH}\`}>`
);
// Find the closing </Svg> for loop 1 and replace it with </Svg>)}
// Looking at the code, it's before `</View>`
// There are two loops, so I will do string replacement carefully.
