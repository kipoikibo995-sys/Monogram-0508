const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  `  return (
    <div className="flex-1 w-full h-full flex items-center justify-center bg-[#e5e5e5] p-8 overflow-y-auto print:p-0 print:bg-white">
      <div className="w-[8.5in] h-[11in] bg-white shadow-xl flex flex-col p-16 print:shadow-none print:w-full print:h-full shrink-0">`,
  `  return (
    <div className={isExport ? "w-full h-full flex flex-col bg-white overflow-hidden p-16 pt-[70px]" : "w-full h-full bg-white flex flex-col p-16 pt-[70px] shrink-0"}>`
);

code = code.replace(
  `           </div>
        </div>
      </div>
    </div>
  );`,
  `           </div>
        </div>
    </div>
  );`
);

fs.writeFileSync('src/BookFlow.tsx', code);
