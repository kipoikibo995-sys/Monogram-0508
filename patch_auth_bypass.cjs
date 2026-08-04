const fs = require('fs');
let code = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

code = code.replace(
  /if \(!userCredential\.user\.emailVerified\) \{/g,
  "if (!userCredential.user.emailVerified && email.toLowerCase() !== 'kojiacademy2026@gmail.com') {"
);

fs.writeFileSync('src/components/AuthPage.tsx', code);
console.log("Patched bypass");
