const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state variables for printing
if (!code.includes('const [isPrinting, setIsPrinting]')) {
  code = code.replace(
    'const [isExporting, setIsExporting] = useState(false);',
    'const [isExporting, setIsExporting] = useState(false);\n  const [isPrinting, setIsPrinting] = useState(false);\n  const [printImages, setPrintImages] = useState<{url: string, type: string}[]>([]);'
  );
}

// 2. Replace handleBulkExportPDF
const startIdx = code.indexOf('  const handleBulkExportPDF = async () => {');
const endIdx = code.indexOf('  };\n\n  return (', startIdx);
if (startIdx !== -1 && endIdx !== -1) {
  const newFunc = `  const handleBulkExportPDF = async () => {
    if (!images.length && !currentProject) return;
    setIsExporting(true);
    
    try {
      const generatedImageUrls: {url: string, type: string}[] = [];
      const exportCanvas = document.createElement('canvas');
      
      const generateDataUrl = async (imgObj: any, mode: 'workbook'|'solution', isFirst: boolean) => {
         renderArt(exportCanvas, imgObj.img, imgObj.settings, Math.min(exportScale, 4), mode, isFirst);
         return exportCanvas.toDataURL('image/jpeg', 0.95);
      };

      if (images.length > 0) {
        let isFirstPage = !currentProject;
        for (let i = 0; i < images.length; i++) {
          generatedImageUrls.push({
            url: await generateDataUrl(images[i], 'workbook', isFirstPage && i === 0),
            type: 'workbook'
          });
          if (isFirstPage && i === 0) isFirstPage = false;
          await new Promise(r => setTimeout(r, 50));
        }
        for (let i = 0; i < images.length; i++) {
          generatedImageUrls.push({
            url: await generateDataUrl(images[i], 'solution', false),
            type: 'solution'
          });
          await new Promise(r => setTimeout(r, 50));
        }
      }
      
      setPrintImages(generatedImageUrls);
      setIsPrinting(true);
      
      setTimeout(() => {
        window.print();
        setIsPrinting(false);
        setIsExporting(false);
        setPrintImages([]);
      }, 1500);
      
    } catch (e) {
      console.error(e);
      alert('Error generating PDF');
      setIsExporting(false);
    }
  };`;
  code = code.substring(0, startIdx) + newFunc + code.substring(endIdx);
}

// 3. Update the render block
// Replace '<div \n      className="h-[100dvh] w-full overflow-hidden bg-neutral-50 flex flex-col font-sans text-neutral-900"'
code = code.replace(
  '<div \n      className="h-[100dvh] w-full overflow-hidden bg-neutral-50 flex flex-col font-sans text-neutral-900"',
  '<div \n      className={`h-[100dvh] w-full overflow-hidden bg-neutral-50 flex flex-col font-sans text-neutral-900 ${isPrinting ? "hidden" : ""}`}'
);

// Remove the old pdf-export-container if it exists
const pdfContainerRegex = /\{\/\* Hidden BookFlow Pages for Export \*\/\}[\s\S]*?id="pdf-export-container"[\s\S]*?<\/div>\s*\)\}/;
code = code.replace(pdfContainerRegex, '');

// Append the print container right before the final closing div
const printContainer = `
      {isPrinting && (
        <div className="absolute top-0 left-0 w-full bg-white z-[99999] print-container" style={{ minHeight: '100vh' }}>
          <style>{\`
            @media print {
              @page { margin: 0; size: 8.5in 11in; }
              body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .print-container { width: 100%; }
              .print-page { page-break-after: always; break-after: page; break-inside: avoid; overflow: hidden; width: 8.5in; height: 11in; position: relative; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; }
              .print-page > div { transform-origin: top left; transform: scale(0.95); width: 850px; height: 1100px; }
            }
            @media screen {
              .print-page { margin: 20px auto; border: 1px solid #ccc; width: 8.5in; height: 11in; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; background: white; }
              .print-page > div { transform: scale(0.95); width: 850px; height: 1100px; }
            }
          \`}</style>
          
          {currentProject && (
            <>
              <div className="print-page"><div className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><CoverPage value={currentProject.bookFlowData?.coverBook} onChange={()=>{}} isExport /></div></div>
              <div className="print-page"><div className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><CopyrightPage value={currentProject.bookFlowData?.copyrightPage} onChange={()=>{}} /></div></div>
              <div className="print-page"><div className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><WelcomePage value={currentProject.bookFlowData?.welcomePage} onChange={()=>{}} /></div></div>
              <div className="print-page"><div className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><MysteryPage value={currentProject.bookFlowData?.mystery} onChange={()=>{}} /></div></div>
              <div className="print-page"><div className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><TemplatePage title="Warm up practice" value={currentProject.bookFlowData?.warmUpPractice} type="warmup" onChange={()=>{}} /></div></div>
              <div className="print-page"><div className="w-[850px] h-[1100px] bg-white flex flex-col shrink-0" style={{ padding: '40px' }}><TemplatePage title="Pen Testing lab" value={currentProject.bookFlowData?.penTestingLab} type="pentesting" onChange={()=>{}} /></div></div>
            </>
          )}
          {printImages.map((img, idx) => (
             <div key={idx} className="print-page">
                <img src={img.url} alt="page" className="w-[8.5in] h-[11in] object-contain p-[36px]" />
             </div>
          ))}
        </div>
      )}
`;

code = code.replace(/<\/div>\s*<ToastContainer/g, printContainer + '\n    </div>\n    <ToastContainer');

// There is one final closing div for the app container:
code = code.replace(/<\/main>\s*<\/div>\s*\);\s*\}/, '</main>\n      ' + printContainer + '\n    </div>\n  );\n}');

fs.writeFileSync('src/App.tsx', code);
