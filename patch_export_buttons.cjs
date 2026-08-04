const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetToReplace = `<button 
              onClick={handleDownloadSVG}
              disabled={isExporting || !image}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-md text-xs font-semibold transition-colors shadow-sm"
            >
              <Download size={14} />
              {isExporting ? 'Exporting...' : 'Export SVG'}
            </button>
            <button 
              onClick={handleDownload}
              disabled={isExporting || !image}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-md text-xs font-semibold transition-colors shadow-sm"
            >
              <Download size={14} />
              {isExporting ? 'Exporting...' : 'Export PNG'}
            </button>
            {images.length > 1 && (
              <>
              <button 
                onClick={handleBulkExportSVG}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-md text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
              >
                <Download size={18} />
                {isExporting ? 'Generating...' : 'Bulk SVG (ZIP)'}
              </button>
              <button 
                onClick={handleBulkExportPDF}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-black disabled:bg-black text-white rounded-md text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
              >
                <BookOpen size={18} />
                {isExporting ? 'Generating...' : 'Bulk PDF'}
              </button>
              </>
            )}`;

const newButtons = `{isExporting && exportStatus && (
              <div className="flex items-center gap-2 mr-2 text-xs font-medium text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-md">
                <span>{exportStatus}</span>
                {exportProgress > 0 && <span className="text-black">{exportProgress}%</span>}
              </div>
            )}
            
            <div className="relative">
              <button 
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                disabled={isExporting || (!image && !images.length)}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-md text-xs font-semibold transition-colors shadow-sm"
              >
                <Download size={14} />
                Export
                <ChevronDown size={14} />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-md shadow-lg py-1 z-50 overflow-hidden">
                  <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-50 border-b border-neutral-100">
                    Single Image
                  </div>
                  <button onClick={() => { setIsExportMenuOpen(false); handleDownloadSVG(); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                    <Download size={14} /> Export SVG
                  </button>
                  <button onClick={() => { setIsExportMenuOpen(false); handleDownload(); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                    <Download size={14} /> Export PNG
                  </button>

                  {images.length > 1 && (
                    <>
                      <div className="px-3 py-2 mt-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-50 border-b border-t border-neutral-100">
                        Entire Book
                      </div>
                      <button onClick={() => { setIsExportMenuOpen(false); handleBulkExportPDF(false); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                        <BookOpen size={14} /> Export Workbook PDF
                      </button>
                      <button onClick={() => { setIsExportMenuOpen(false); handleBulkExportPDF(true); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                        <BookOpen size={14} /> Export Solutions PDF
                      </button>
                      <button onClick={() => { setIsExportMenuOpen(false); handleBulkExportSVG(); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors border-t border-neutral-100 mt-1">
                        <Download size={14} /> Export SVG (ZIP)
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>`;

if (code.includes(targetToReplace)) {
  code = code.replace(targetToReplace, newButtons);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Success string match');
} else {
  // Let's use a very safe regex that only targets the exact block inside the header.
  const safeRegex = /<button[\s\S]*?onClick=\{handleDownloadSVG\}[\s\S]*?<\/button>[\s\S]*?<button[\s\S]*?onClick=\{handleDownload\}[\s\S]*?<\/button>[\s\S]*?\{images\.length > 1 && \([\s\S]*?<\/button>[\s\S]*?<\/button>[\s\S]*?<\/>\s*\)\}/;
  
  // To be super safe, check that this regex matches only once and ends before </header>
  const match = code.match(safeRegex);
  if (match) {
    // only replace if we are within the <header> block!
    const index = match.index;
    const headerEnd = code.indexOf('</header>');
    if (index < headerEnd) {
      code = code.replace(safeRegex, newButtons);
      fs.writeFileSync('src/App.tsx', code);
      console.log('Success regex match in header');
    } else {
      console.log('Regex matched outside header, unsafe to replace!');
    }
  } else {
    console.log('Regex failed.');
  }
}
