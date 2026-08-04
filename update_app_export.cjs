const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add states
code = code.replace(
  /const \[isExporting, setIsExporting\] = useState\(false\);/,
  `const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);`
);

// Replace handleBulkExportPDF
const oldHandleBulkExportPDF = `  const handleBulkExportPDF = async () => {
    if (!images.length && !currentProject) return;
    
    const exportType = window.confirm("Do you want to export the SOLUTIONS book? \\n\\nClick 'OK' for Solutions.\\nClick 'Cancel' for the main Workbook.");
    
    setIsExporting(true);
    
    try {
      const processedImages = images.map(img => processImageForPdf(img.img, img.settings));
      const doc = <PdfDocument project={currentProject!} processedImages={processedImages} isExportingSolutions={exportType} />;
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

const newHandleBulkExportPDF = `  const handleBulkExportPDF = async (exportType: boolean) => {
    if (!images.length && !currentProject) return;
    
    setIsExporting(true);
    setIsExportMenuOpen(false);
    setExportProgress(0);
    setExportStatus('Processing images...');
    
    try {
      const processedImages = [];
      for (let i = 0; i < images.length; i++) {
        setExportProgress(Math.round(((i) / images.length) * 50));
        await new Promise(r => setTimeout(r, 10)); // Yield
        processedImages.push(processImageForPdf(images[i].img, images[i].settings));
      }
      
      setExportStatus('Generating PDF layout (this may take a minute)...');
      setExportProgress(50);
      
      await new Promise(r => setTimeout(r, 50));
      
      const doc = <PdfDocument project={currentProject!} processedImages={processedImages} isExportingSolutions={exportType} />;
      
      const blob = await pdf(doc).toBlob();
      
      setExportProgress(100);
      setExportStatus('Download starting...');
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = \`\${currentProject?.name || 'export'}-\${exportType ? 'solutions' : 'workbook'}.pdf\`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Error exporting vector PDF');
    } finally {
      setIsExporting(false);
      setExportStatus('');
      setExportProgress(0);
    }
  };`;

code = code.replace(oldHandleBulkExportPDF, newHandleBulkExportPDF);

fs.writeFileSync('src/App.tsx', code);
