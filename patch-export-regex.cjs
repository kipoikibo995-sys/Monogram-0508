const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = code.indexOf('  const handleBulkExportPDF = async () => {');
const endIdx = code.indexOf('  };', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newFunc = `  const handleBulkExportPDF = async () => {
    // We allow export if there are either images OR a current project
    if (!images.length && !currentProject) return;
    setIsExporting(true);
    
    try {
      const { jsPDF } = await import('jspdf');
      
      const trimSizeMapping: Record<string, [number, number]> = {
        '8.5x11': [612, 792],
        '6x9': [432, 648],
        '8.5x8.5': [612, 612]
      };
      
      const gSettings = activeSettings;
      const pdfFormat = trimSizeMapping[gSettings.trimSize || '8.5x11'];
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: pdfFormat
      });

      let pageCount = 0;
      
      const addDataUrlToPDF = (dataUrl: string, isFirst: boolean, margin = 0, gutter = 0) => {
        pageCount++;
        const isLeftPage = pageCount % 2 === 0;
        const leftMargin = isLeftPage ? margin : margin + gutter;
        const rightMargin = isLeftPage ? margin + gutter : margin;
        
        const maxWidth = pdfFormat[0] - leftMargin - rightMargin;
        const maxHeight = pdfFormat[1] - margin * 2;
        
        if (!isFirst) pdf.addPage();
        pdf.addImage(dataUrl, 'JPEG', leftMargin, margin, maxWidth, maxHeight);
      };

      // 1. Export BookFlow Pages First
      let isFirstPage = true;
      if (currentProject) {
        const pagesToExport = ['cover', 'copyright', 'welcome', 'mystery', 'warmup', 'pentesting'];
        for (const pageId of pagesToExport) {
          const el = document.getElementById(\`export-page-\${pageId}\`);
          if (el) {
            const canvas = await html2canvas(el, { scale: 2, useCORS: true });
            addDataUrlToPDF(canvas.toDataURL('image/jpeg', 0.95), isFirstPage);
            isFirstPage = false;
            await new Promise(r => setTimeout(r, 50));
          }
        }
      }

      // 2. Export generated images
      const exportCanvas = document.createElement('canvas');
      const addImageToPDF = (imgObj: any, mode: 'workbook'|'solution', isFirst: boolean) => {
        renderArt(exportCanvas, imgObj.img, imgObj.settings, Math.min(exportScale, 4), mode, isFirst);
        pageCount++;
        
        const margin = gSettings.pageMargin || 36;
        const gutter = gSettings.gutterMargin || 0;
        
        const isLeftPage = pageCount % 2 === 0;
        const leftMargin = isLeftPage ? margin : margin + gutter;
        const rightMargin = isLeftPage ? margin + gutter : margin;
        
        const maxWidth = pdfFormat[0] - leftMargin - rightMargin;
        const maxHeight = pdfFormat[1] - margin * 2;
        
        const canvasAspect = exportCanvas.width / exportCanvas.height;
        const pageAspect = maxWidth / maxHeight;
        
        let finalWidth = maxWidth;
        let finalHeight = maxWidth / canvasAspect;
        
        if (canvasAspect < pageAspect) {
          finalHeight = maxHeight;
          finalWidth = maxHeight * canvasAspect;
        }
        
        const x = leftMargin + (maxWidth - finalWidth) / 2;
        const y = margin + (maxHeight - finalHeight) / 2;
        
        if (!isFirst) pdf.addPage();
        
        pdf.addImage(exportCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', x, y, finalWidth, finalHeight);
      };

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          addImageToPDF(images[i], 'workbook', isFirstPage && i === 0);
          if (isFirstPage && i === 0) isFirstPage = false;
          await new Promise(r => setTimeout(r, 50));
        }
        
        for (let i = 0; i < images.length; i++) {
          addImageToPDF(images[i], 'solution', false);
          await new Promise(r => setTimeout(r, 50));
        }
      }
      
      pdf.save(\`kdp-book-export-\${Date.now()}.pdf\`);
    } catch (e) {
      console.error(e);
      alert('Error generating PDF');
    } finally {
      setIsExporting(false);
    }`;

    code = code.substring(0, startIdx) + newFunc + code.substring(endIdx + 4);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find start or end index.");
}
