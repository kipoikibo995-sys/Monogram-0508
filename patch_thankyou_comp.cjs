const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

const thankYouCode = `
// --- ThankYouPage Component ---
export const ThankYouPage = ({ value, onChange, isExport }: { value?: string; onChange: (v: string) => void; isExport?: boolean }) => {
  let parsedValue = {
    title: 'Thank You for Coloring With Us',
    heading1: 'You Revealed the Mystery — Well Done!',
    body1: 'You made it through every hidden creature, every shadowy secret, every spooky surprise.\\nThat takes patience, focus, and a seriously steady hand.',
    heading2: 'Did something make you smile? Surprise you? Creep you out (in the best way)?',
    body2: 'An honest review on Amazon, even just one sentence — helps other puzzle lovers find this book and keeps this series growing.\\nSearch "101 Spooky Monochrome Color By Number Mysteries Alan Parker" on Amazon to leave your review.\\nIt takes 60 seconds and means everything to an independent creator. Thank you.',
    heading3: 'Love One-Pen Puzzles? Explore the Full Series:',
    body3: 'Search "Monochrome Color by Number Alan Parker" on Amazon to find all volumes.',
  };
  try {
    if (value) {
      parsedValue = { ...parsedValue, ...JSON.parse(value) };
    }
  } catch (e) {}

  const handleChange = (key: string, val: string) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };

  return (
    <div className="flex-1 w-full h-full flex items-center justify-center bg-[#e5e5e5] p-8 overflow-y-auto print:p-0 print:bg-white">
      <div className="w-[8.5in] h-[11in] bg-white shadow-xl flex flex-col p-16 print:shadow-none print:w-full print:h-full shrink-0">
        <textarea
           value={parsedValue.title}
           onChange={(e) => handleChange('title', e.target.value)}
           className="w-full text-center text-3xl font-bold text-black outline-none bg-transparent resize-none leading-normal font-sans mb-12"
           rows={1}
        />

        <div className="flex flex-col gap-8 max-w-[80%] mx-auto w-full font-sans text-black">
           <div>
             <textarea
                value={parsedValue.heading1}
                onChange={(e) => handleChange('heading1', e.target.value)}
                className="w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal"
                rows={1}
             />
             <textarea
                value={parsedValue.body1}
                onChange={(e) => handleChange('body1', e.target.value)}
                className="w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1"
                rows={2}
             />
           </div>

           <div>
             <textarea
                value={parsedValue.heading2}
                onChange={(e) => handleChange('heading2', e.target.value)}
                className="w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal"
                rows={2}
             />
             <textarea
                value={parsedValue.body2}
                onChange={(e) => handleChange('body2', e.target.value)}
                className="w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1"
                rows={4}
             />
           </div>

           <div>
             <textarea
                value={parsedValue.heading3}
                onChange={(e) => handleChange('heading3', e.target.value)}
                className="w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal"
                rows={1}
             />
             <textarea
                value={parsedValue.body3}
                onChange={(e) => handleChange('body3', e.target.value)}
                className="w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1"
                rows={2}
             />
           </div>
        </div>
      </div>
    </div>
  );
};

`;

code = code + thankYouCode;

fs.writeFileSync('src/BookFlow.tsx', code);
