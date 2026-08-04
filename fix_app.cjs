const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
`                {userTier === 'free' ? (
                  <button 
                  disabled
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-300 text-neutral-500 rounded-md text-sm font-semibold cursor-not-allowed shadow-sm"
                >
                ) : (
                  <button 
                  onClick={createNewProject}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm"
                >
                )}
                  <Plus size={16}/> Create New Book
                </button>`,
`                {userTier === 'free' ? (
                  <button disabled className="flex items-center gap-2 px-4 py-2 bg-neutral-300 text-neutral-500 rounded-md text-sm font-semibold cursor-not-allowed shadow-sm">
                    <Plus size={16}/> Create New Book
                  </button>
                ) : (
                  <button onClick={createNewProject} className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">
                    <Plus size={16}/> Create New Book
                  </button>
                )}`
);

code = code.replace(
`                  {userTier === 'free' ? (
                    <button 
                    disabled
                    className="flex items-center gap-2 px-6 py-2.5 bg-neutral-300 text-neutral-500 rounded-md text-sm font-semibold cursor-not-allowed shadow-sm"
                  >
                  ) : (
                    <button 
                    onClick={createNewProject}
                    className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm"
                  >
                  )}
                    <Plus size={18}/> Create New Book
                  </button>`,
`                  {userTier === 'free' ? (
                    <button disabled className="flex items-center gap-2 px-6 py-2.5 bg-neutral-300 text-neutral-500 rounded-md text-sm font-semibold cursor-not-allowed shadow-sm">
                      <Plus size={18}/> Create New Book
                    </button>
                  ) : (
                    <button onClick={createNewProject} className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">
                      <Plus size={18}/> Create New Book
                    </button>
                  )}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed JSX syntax in App.tsx");
