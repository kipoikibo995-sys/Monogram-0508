const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

code = code.replace(
  `interface PdfExportProps {
  project: Project;
  processedImages: ProcessedImage[];
  isExportingSolutions: boolean;
}`,
  `interface PdfExportProps {
  project: Project;
  processedImages: ProcessedImage[];
  isExportingSolutions: boolean;
  userTier?: 'free' | 'pro' | 'enterprise';
}`
);

code = code.replace(
  `export const PdfDocument = ({ project, processedImages, isExportingSolutions }: PdfExportProps) => {`,
  `export const PdfDocument = ({ project, processedImages, isExportingSolutions, userTier = 'free' }: PdfExportProps) => {`
);

fs.writeFileSync('src/PdfExport.tsx', code);
