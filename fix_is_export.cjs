const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

// CopyrightPage
code = code.replace(
  "export const CopyrightPage = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {",
  "export const CopyrightPage = ({ value, onChange, isExport }: { value?: string; onChange: (v: string) => void; isExport?: boolean }) => {"
);

// WelcomePage
code = code.replace(
  "export const WelcomePage = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {",
  "export const WelcomePage = ({ value, onChange, isExport }: { value?: string; onChange: (v: string) => void; isExport?: boolean }) => {"
);

// MysteryPage
code = code.replace(
  "export const MysteryPage = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {",
  "export const MysteryPage = ({ value, onChange, isExport }: { value?: string; onChange: (v: string) => void; isExport?: boolean }) => {"
);

// TemplatePage
code = code.replace(
  "export const TemplatePage = ({ title, type, value, onChange }: { title: string; type: 'warmup' | 'pentesting'; value?: string; onChange: (v: string) => void }) => {",
  "export const TemplatePage = ({ title, type, value, onChange, isExport }: { title: string; type: 'warmup' | 'pentesting'; value?: string; onChange: (v: string) => void; isExport?: boolean }) => {"
);

// CoverPage - Add image button
code = code.replace(
  "{imgCount < 4 && (",
  "{imgCount < 4 && !isExport && ("
);

// TemplatePage - remove list item
code = code.replace(
  "                  <button onClick={() => removeListItem(idx)}",
  "                  {!isExport && <button onClick={() => removeListItem(idx)}"
);
code = code.replace(
  "                    <Trash2 size={12} />\n                </button>",
  "                    <Trash2 size={12} />\n                </button>}"
);

// TemplatePage - add list item
code = code.replace(
  "            <button onClick={addListItem}",
  "            {!isExport && <button onClick={addListItem}"
);
code = code.replace(
  "              <Plus size={14} /> Add item\n            </button>",
  "              <Plus size={14} /> Add item\n            </button>}"
);

// TemplatePage - Trash icon for image
code = code.replace(
  "                  <button \n                    onClick={() => removeImage()}",
  "                  {!isExport && <button \n                    onClick={() => removeImage()}"
);
code = code.replace(
  "                    <Trash2 size={24} />\n                 </button>",
  "                    <Trash2 size={24} />\n                 </button>}"
);

// TemplatePage - Upload box
code = code.replace(
  "              <div \n                 onClick={() => fileInputRef.current?.click()}",
  "              {!isExport && <div \n                 onClick={() => fileInputRef.current?.click()}"
);
code = code.replace(
  "                 <p className=\"mt-4 text-sm font-medium\">Click to add image</p>\n              </div>",
  "                 <p className=\"mt-4 text-sm font-medium\">Click to add image</p>\n              </div>}"
);

fs.writeFileSync('src/BookFlow.tsx', code);
