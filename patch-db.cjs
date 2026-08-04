const fs = require('fs');
let code = fs.readFileSync('src/db.ts', 'utf8');

const regex = /export interface Project \{[\s\S]*?\}/;
const replace = `export interface BookFlowData {
  coverBook?: string; // image data URL or text
  copyrightPage?: string;
  welcomePage?: string;
  warmUpPractice?: string;
  penTestingLab?: string;
  mystery?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  imageCount: number;
  bookFlowData?: BookFlowData;
}`;

code = code.replace(regex, replace);
fs.writeFileSync('src/db.ts', code);
