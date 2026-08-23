const fs = require('fs');

const serverContent = fs.readFileSync('server.ts', 'utf8');
const apiContent = fs.readFileSync('api/index.ts', 'utf8');

const serverEndpointsStart = serverContent.indexOf("app.post('/api/wplus/ipn'");
const serverEndpointsEnd = serverContent.indexOf("if (process.env.NODE_ENV !== \"production\") {");

if (serverEndpointsStart === -1 || serverEndpointsEnd === -1) {
    console.error("Could not find endpoints in server.ts");
    process.exit(1);
}

const serverEndpoints = serverContent.substring(serverEndpointsStart, serverEndpointsEnd);

const apiEndpointsStart = apiContent.indexOf("app.post('/api/wplus/ipn'");
const apiEndpointsEnd = apiContent.indexOf("export default app;");

if (apiEndpointsStart === -1 || apiEndpointsEnd === -1) {
    console.error("Could not find endpoints in api/index.ts");
    process.exit(1);
}

const newApiContent = apiContent.substring(0, apiEndpointsStart) + serverEndpoints + "\n" + apiContent.substring(apiEndpointsEnd);

fs.writeFileSync('api/index.ts', newApiContent);
console.log("Successfully patched api/index.ts with endpoints from server.ts");
