const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldLogic = `
      const data = req.body;
      console.log("Received WarriorPlus IPN:", data);
`;

const newLogic = `
      const data = req.body;
      console.log("Received WarriorPlus IPN:", data);
      
      // Handle empty ping or test
      if (Object.keys(data).length === 0 || !data.WP_ACTION) {
         return res.status(200).send("Ping OK");
      }
      if (data.WP_ACTION === 'test') {
         return res.status(200).send("Test OK");
      }
`;
code = code.replace(oldLogic, newLogic);

fs.writeFileSync('server.ts', code);
