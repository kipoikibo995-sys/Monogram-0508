const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace("app.use(express.urlencoded({ extended: true }));", "");

const customBody = `
  app.post('/api/wplus/ipn', express.urlencoded({ extended: true, type: '*/*' }), async (req, res) => {
`;

content = content.replace("app.post('/api/wplus/ipn', async (req, res) => {", customBody);

fs.writeFileSync('server.ts', content);
