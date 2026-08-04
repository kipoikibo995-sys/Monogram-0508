const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  "           className=\"w-full text-center text-3xl font-bold text-black outline-none bg-transparent resize-none leading-normal font-sans mb-12\"\n           rows={1}",
  "           className=\"w-full text-center text-3xl font-bold text-black outline-none bg-transparent resize-none leading-normal font-sans mb-12\"\n           rows={2}"
);

code = code.replace(
  "                className=\"w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal\"\n                rows={1}",
  "                className=\"w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal\"\n                rows={2}"
);

code = code.replace(
  "                className=\"w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1\"\n                rows={2}",
  "                className=\"w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1\"\n                rows={3}"
);

code = code.replace(
  "                className=\"w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal\"\n                rows={2}",
  "                className=\"w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal\"\n                rows={2}"
);

code = code.replace(
  "                className=\"w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1\"\n                rows={4}",
  "                className=\"w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1\"\n                rows={5}"
);

code = code.replace(
  "                className=\"w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal\"\n                rows={1}",
  "                className=\"w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal\"\n                rows={2}"
);

code = code.replace(
  "                className=\"w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1\"\n                rows={2}",
  "                className=\"w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1\"\n                rows={3}"
);

fs.writeFileSync('src/BookFlow.tsx', code);
