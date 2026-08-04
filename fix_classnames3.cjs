const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

// First remove the injected <textarea className="overflow-hidden"
code = code.replace(/<textarea className="overflow-hidden"/g, '<textarea');
// Now find all textareas and add overflow-hidden to their classNames if not present
// textareas always have a className in BookFlow.tsx
let lines = code.split('\n');
let inTextarea = false;
for (let i=0; i<lines.length; i++) {
    if (lines[i].includes('<textarea')) inTextarea = true;
    if (inTextarea && lines[i].includes('className="')) {
        if (!lines[i].includes('overflow-hidden')) {
            lines[i] = lines[i].replace('className="', 'className="overflow-hidden ');
        }
    }
    if (inTextarea && lines[i].includes('/>')) inTextarea = false;
}
fs.writeFileSync('src/BookFlow.tsx', lines.join('\n'));
