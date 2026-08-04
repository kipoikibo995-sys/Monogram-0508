const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

// Replace the copyright case in renderContent
code = code.replace(
  `      case 'copyright':\n        return <TextPage value={data.copyrightPage} onChange={(v) => handleUpdateData('copyrightPage', v)} placeholder="Type copyright information here..." />;`,
  `      case 'copyright':\n        return <CopyrightPage value={data.copyrightPage} onChange={(v) => handleUpdateData('copyrightPage', v)} />;`
);

const copyrightComponent = `
// --- CopyrightPage Component ---
const CopyrightPage = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
  let parsedValue = {
    title: 'COPYRIGHT PAGE',
    year: '2026',
    author: 'Alan Parker',
    rights: 'All Rights Reserved.',
    description: 'No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means—electronic, mechanical, photocopying, recording, or otherwise—without prior written permission from the author.',
    isbn: '9798188106522',
    imprint: 'Independently published'
  };

  try {
    if (value) {
      if (value.startsWith('{')) {
        parsedValue = { ...parsedValue, ...JSON.parse(value) };
      } else {
         // Migration from plain text
         parsedValue.description = value;
      }
    }
  } catch (e) {}

  const handleChange = (key: string, val: string) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center font-sans p-12">
      <div className="w-full h-full flex flex-col items-center pt-20">
        <input
          value={parsedValue.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="text-center font-bold text-[32px] text-black outline-none w-full bg-transparent uppercase hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors"
        />

        <div className="w-full max-w-3xl flex flex-col gap-8 mt-24 text-[22px] text-black">
          <div>
            <div className="flex items-center font-bold">
              <span>Copyright ©</span>
              <input
                value={parsedValue.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className="w-16 ml-2 outline-none bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black"
              />
              <input
                value={parsedValue.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="flex-1 outline-none bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black"
              />
            </div>
            <input
              value={parsedValue.rights}
              onChange={(e) => handleChange('rights', e.target.value)}
              className="font-bold outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded mt-1 transition-colors text-black"
            />
          </div>

          <textarea
            value={parsedValue.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full resize-none outline-none bg-transparent text-[22px] leading-[1.6] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black"
            rows={5}
          />

          <div>
            <div className="flex items-center font-bold">
              <span>ISBN:</span>
              <input
                value={parsedValue.isbn}
                onChange={(e) => handleChange('isbn', e.target.value)}
                className="flex-1 ml-2 outline-none bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded font-normal transition-colors text-black"
              />
            </div>
            <div className="flex items-center font-bold mt-1">
              <span>Imprint:</span>
              <input
                value={parsedValue.imprint}
                onChange={(e) => handleChange('imprint', e.target.value)}
                className="flex-1 ml-2 outline-none bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded font-normal transition-colors text-black"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
`;

// Insert the new component just above TextPage
code = code.replace('// --- TextPage Component ---', copyrightComponent + '\n// --- TextPage Component ---');

fs.writeFileSync('src/BookFlow.tsx', code);
