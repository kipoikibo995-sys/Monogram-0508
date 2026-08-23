const fs = require('fs');
let content = fs.readFileSync('api/index.ts', 'utf8');

content = content.replace("app.use(express.urlencoded({ extended: true, type: '*/*' }));", "app.use(express.urlencoded({ extended: true }));");

// Now let's inject a custom raw body reader just for the IPN route in case Express fails
const ipnIndex = content.indexOf("app.post('/api/wplus/ipn', async (req, res) => {");

const customBody = `
app.post('/api/wplus/ipn', express.urlencoded({ extended: true, type: '*/*' }), async (req, res) => {
`;

content = content.replace("app.post('/api/wplus/ipn', async (req, res) => {", customBody);

fs.writeFileSync('api/index.ts', content);
