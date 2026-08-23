const fs = require('fs');
let content = fs.readFileSync('api/index.ts', 'utf8');

if (!content.includes('export const config')) {
    content += `\nexport const config = {\n  api: {\n    bodyParser: false,\n  },\n};\n`;
}

content = content.replace("app.use(express.urlencoded({ extended: true }));", "app.use(express.urlencoded({ extended: true, type: '*/*' }));");

fs.writeFileSync('api/index.ts', content);
