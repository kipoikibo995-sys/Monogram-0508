const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Replace const PAGE_SIZE = ... with dynamic retrieval
code = code.replace(/const PAGE_SIZE = \[850, 1100\];[^\n]*\n/g, '');

// Inside PdfDocument, define pageSize based on processedImages
code = code.replace(/export const PdfDocument = \(\{ project, processedImages, isExportingSolutions \}: PdfExportProps\) => \{/,
  `export const PdfDocument = ({ project, processedImages, isExportingSolutions }: PdfExportProps) => {
  const trimSize = processedImages[0]?.settings?.trimSize || '8.5x11';
  const PAGE_SIZE = trimSize === '8.5x11' ? [612, 792] : trimSize === '6x9' ? [432, 648] : [612, 612];
  const safeMargin = 36;
  const gutter = processedImages[0]?.settings?.gutterMargin || 0;
`);

fs.writeFileSync('src/PdfExport.tsx', code);
