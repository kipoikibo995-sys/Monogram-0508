const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(
  `const handleBulkExportPDF = async () => {
    if (!images.length && !currentProject) return;
    setIsExporting(true);
    
    try {
      const processedImages = images.map(img => processImageForPdf(img.img, img.settings));
      const doc = <PdfDocument project={currentProject!} processedImages={processedImages} isExportingSolutions={false} />;`,
  `const handleBulkExportPDF = async () => {
    if (!images.length && !currentProject) return;
    
    const exportType = window.confirm("Do you want to export the SOLUTIONS book? \\n\\nClick 'OK' for Solutions.\\nClick 'Cancel' for the main Workbook.");
    
    setIsExporting(true);
    
    try {
      const processedImages = images.map(img => processImageForPdf(img.img, img.settings));
      const doc = <PdfDocument project={currentProject!} processedImages={processedImages} isExportingSolutions={exportType} />;`
);

fs.writeFileSync('src/App.tsx', appCode);
console.log("App.tsx export prompt updated");
