const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove isPrinting state
code = code.replace(
  'const [isExporting, setIsExporting] = useState(false);\n  const [isPrinting, setIsPrinting] = useState(false);\n  const [printImages, setPrintImages] = useState<{url: string, type: string}[]>([]);',
  'const [isExporting, setIsExporting] = useState(false);'
);

// 2. Replace handleBulkExportPDF
const startIdx = code.indexOf('  const handleBulkExportPDF = async () => {');
const endIdx = code.indexOf('  };\n\n  return (', startIdx);
if (startIdx !== -1 && endIdx !== -1) {
  const newFunc = `  const handleBulkExportPDF = async () => {
    if (!images.length && !currentProject) return;
    setIsExporting(true);
    
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      
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

      // 1. Export BookFlow Pages First
      let isFirstPage = true;
      if (currentProject) {
        // Temporarily reveal container off-screen to ensure accurate html2canvas capture without opacity issues
        const exportContainer = document.getElementById('pdf-export-container');
        if (exportContainer) {
           exportContainer.style.position = 'absolute';
           exportContainer.style.left = '-9999px';
           exportContainer.style.top = '0px';
           exportContainer.style.opacity = '1';
           exportContainer.style.display = 'block';
        }

        const pagesToExport = ['cover', 'copyright', 'welcome', 'mystery', 'warmup', 'pentesting'];
        for (const pageId of pagesToExport) {
          const el = document.getElementById(\`export-page-\${pageId}\`);
          if (el) {
            // Give browser a moment to apply styles
            await new Promise(r => setTimeout(r, 100));
            const canvas = await html2canvas(el, { scale: 2, useCORS: true, allowTaint: true });
            const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
            
            if (!isFirstPage) pdf.addPage();
            
            const canvasAspect = canvas.width / canvas.height;
            const pageAspect = pdfFormat[0] / pdfFormat[1];
            let finalWidth = pdfFormat[0];
            let finalHeight = pdfFormat[0] / canvasAspect;
            if (canvasAspect < pageAspect) {
               finalHeight = pdfFormat[1];
               finalWidth = pdfFormat[1] * canvasAspect;
            }
            const x = (pdfFormat[0] - finalWidth) / 2;
            const y = (pdfFormat[1] - finalHeight) / 2;
            
            pdf.addImage(dataUrl, 'JPEG', x, y, finalWidth, finalHeight);
            
            isFirstPage = false;
            pageCount++;
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
    }
  };`;
  code = code.substring(0, startIdx) + newFunc + code.substring(endIdx);
}

// 3. Remove isPrinting from main div
code = code.replace(
  '<div \n      className={`h-[100dvh] w-full overflow-hidden bg-neutral-50 flex flex-col font-sans text-neutral-900 ${isPrinting ? "hidden" : ""}`}',
  '<div \n      className="h-[100dvh] w-full overflow-hidden bg-neutral-50 flex flex-col font-sans text-neutral-900"'
);

// 4. Remove print block and replace with hidden PDF container
const printContainerRegex = /\{isPrinting && \([\s\S]*?\)\}/;

const pdfContainer = `
      {/* Hidden BookFlow Pages for Export */}
      {currentProject && (
        <div id="pdf-export-container" style={{ position: "absolute", left: "-9999px", top: 0, opacity: 1 }}>
          <div id="export-page-cover" className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><CoverPage value={currentProject.bookFlowData?.coverBook} onChange={()=>{}} isExport /></div>
          <div id="export-page-copyright" className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><CopyrightPage value={currentProject.bookFlowData?.copyrightPage} onChange={()=>{}} /></div>
          <div id="export-page-welcome" className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><WelcomePage value={currentProject.bookFlowData?.welcomePage} onChange={()=>{}} /></div>
          <div id="export-page-mystery" className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><MysteryPage value={currentProject.bookFlowData?.mystery} onChange={()=>{}} /></div>
          <div id="export-page-warmup" className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><TemplatePage title="Warm up practice" value={currentProject.bookFlowData?.warmUpPractice} type="warmup" onChange={()=>{}} /></div>
          <div id="export-page-pentesting" className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><TemplatePage title="Pen Testing lab" value={currentProject.bookFlowData?.penTestingLab} type="pentesting" onChange={()=>{}} /></div>
        </div>
      )}
`;

code = code.replace(printContainerRegex, pdfContainer);

fs.writeFileSync('src/App.tsx', code);
