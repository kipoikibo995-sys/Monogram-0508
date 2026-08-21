const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard links
appTsx = appTsx.replace(/https:\/\/warriorplus\.com/g, 'https://kojilaunch.com/monogram-version/');

// Replace alerts with confirms + window.open
const alert1 = 'alert("Free tier is limited to 5 projects. Please upgrade to Pro to create more.");';
const alert1New = 'if (window.confirm("Free tier is limited to 5 projects. Would you like to upgrade to Pro to create more?")) { window.open("https://kojilaunch.com/monogram-version/", "_blank"); }';
appTsx = appTsx.replace(alert1, alert1New);

const alert2 = 'alert(`Your tier (${userTier}) is limited to ${maxPages} pages per book. Please upgrade to add more.`);';
const alert2New = 'if (window.confirm(`Your tier (${userTier}) is limited to ${maxPages} pages per book. Would you like to upgrade to add more?`)) { window.open("https://kojilaunch.com/monogram-version/", "_blank"); }';
appTsx = appTsx.replace(alert2, alert2New);

const alert3 = 'alert("Export SVG (Full photo) is a Pro feature. Please upgrade.");';
const alert3New = 'if (window.confirm("Export SVG (Full photo) is a Pro feature. Would you like to upgrade now?")) { window.open("https://kojilaunch.com/monogram-version/", "_blank"); }';
appTsx = appTsx.replace(alert3, alert3New);

const alert4 = 'alert("Export PNG (Full photo) is a Pro feature. Please upgrade.");';
const alert4New = 'if (window.confirm("Export PNG (Full photo) is a Pro feature. Would you like to upgrade now?")) { window.open("https://kojilaunch.com/monogram-version/", "_blank"); }';
appTsx = appTsx.replace(alert4, alert4New);

const alert5 = 'alert(`The ${shape} pixel shape is only available in the Pro version. Please upgrade.`);';
const alert5New = 'if (window.confirm(`The ${shape} pixel shape is only available in the Pro version. Would you like to upgrade now?`)) { window.open("https://kojilaunch.com/monogram-version/", "_blank"); }';
appTsx = appTsx.replace(alert5, alert5New);

fs.writeFileSync('src/App.tsx', appTsx);

let bookFlowTsx = fs.readFileSync('src/BookFlow.tsx', 'utf8');
const bookAlert = "alert('Upgrade to Pro to unlock this feature!')";
const bookAlertNew = "window.open('https://kojilaunch.com/monogram-version/', '_blank')";
bookFlowTsx = bookFlowTsx.replace(bookAlert, bookAlertNew);

// Also add confirm prompt to bookAlert just in case
// Wait, the BookFlow is actually a lock screen over the content.
// A window.open is perfectly fine.

fs.writeFileSync('src/BookFlow.tsx', bookFlowTsx);

console.log("Patched links!");
