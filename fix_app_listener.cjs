const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /unsubDoc = onSnapshot\(userRef, \(snap\) => \{/g,
  `if (auth.currentUser?.uid !== currentUser.uid) return;\n          unsubDoc = onSnapshot(userRef, (snap) => {`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed async listener bug");
