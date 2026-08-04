const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

if (!appCode.includes("import { pdf } from '@react-pdf/renderer';")) {
  appCode = appCode.replace(
    "import { BookFlow, CoverPage, CopyrightPage, WelcomePage, MysteryPage, TemplatePage, ThankYouPage } from './BookFlow';",
    "import { BookFlow, CoverPage, CopyrightPage, WelcomePage, MysteryPage, TemplatePage, ThankYouPage } from './BookFlow';\nimport { pdf } from '@react-pdf/renderer';\nimport { PdfDocument, processImageForPdf } from './PdfExport';"
  );
}

const regex = /const handleBulkExportPDF = async \(\) => \{[\s\S]*?setIsExporting\(false\);\s*\}\s*\};/;

const newExportLogic = `const handleBulkExportPDF = async () => {
    if (!images.length && !currentProject) return;
    setIsExporting(true);
    
    try {
      const processedImages = images.map(img => processImageForPdf(img.img, img.settings));
      const doc = <PdfDocument project={currentProject!} processedImages={processedImages} isExportingSolutions={false} />;
      const blob = await pdf(doc).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = \`\${currentProject?.name || 'export'}.pdf\`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Error exporting vector PDF');
    } finally {
      setIsExporting(false);
    }
  };`;

appCode = appCode.replace(regex, newExportLogic);

// Try to remove hidden container
appCode = appCode.replace(/\{\/\* Hidden BookFlow Pages for Export \*\/\}[\s\S]*?<\/div>\s*\)\}\s*<\/div>/, "</div>");

fs.writeFileSync('src/App.tsx', appCode);
console.log("App.tsx export updated");
