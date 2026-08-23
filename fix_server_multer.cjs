const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

if (!content.includes('import multer')) {
    content = content.replace("import cors from 'cors';", "import cors from 'cors';\nimport multer from 'multer';\nconst upload = multer();");
}

const customBody = `
  app.post('/api/wplus/ipn', upload.none(), express.urlencoded({ extended: true }), async (req, res) => {
`;

content = content.replace("app.post('/api/wplus/ipn', express.urlencoded({ extended: true, type: '*/*' }), async (req, res) => {", customBody);

fs.writeFileSync('server.ts', content);
