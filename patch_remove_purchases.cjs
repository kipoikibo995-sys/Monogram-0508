const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

const thRegex = /<th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black border-l border-white\/20">Purchases<\/th>\n/;
code = code.replace(thRegex, "");

const tdRegex = /                    <td className="py-4 px-4 align-top border-r border-black">\n                      <div className="text-sm font-medium text-black">\n                        \{!u\.purchases \|\| u\.purchases\.length === 0 \? \(\n                          <span className="text-neutral-500 italic">No purchases<\/span>\n                        \) : \(\n                          <ul className="list-disc pl-4">\n                            \{u\.purchases\.map\(\(p, idx\) => \(\n                              <li key=\{idx\}>\{p\.item \|\| JSON\.stringify\(p\)\}<\/li>\n                            \)\)\}\n                          <\/ul>\n                        \)\}\n                      <\/div>\n                    <\/td>\n/;
code = code.replace(tdRegex, "");

fs.writeFileSync('src/components/AdminView.tsx', code);
