const fs = require('fs');
let code = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

code = code.replace(
  /if \(!userCredential\.user\.emailVerified && email\.toLowerCase\(\) !== 'kojiacademy2026@gmail\.com'\) \{/,
  `
          let isPaid = false;
          try {
            const checkRes = await fetch('/api/user/check-paid', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
            const data = await checkRes.json();
            if (data.isPaid) isPaid = true;
          } catch(e) { console.error("Check paid error:", e); }

          if (!userCredential.user.emailVerified && email.toLowerCase() !== 'kojiacademy2026@gmail.com' && !isPaid) {
  `
);

code = code.replace(
  /const userCredential = await signInWithEmailAndPassword\(auth, email, password\);\n\s*if \(!userCredential\.user\.emailVerified && email\.toLowerCase\(\) !== 'kojiacademy2026@gmail\.com'\) \{/,
  `const userCredential = await signInWithEmailAndPassword(auth, email, password);
      let isPaid = false;
      try {
        const checkRes = await fetch('/api/user/check-paid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await checkRes.json();
        if (data.isPaid) isPaid = true;
      } catch(e) { console.error("Check paid error:", e); }

      if (!userCredential.user.emailVerified && email.toLowerCase() !== 'kojiacademy2026@gmail.com' && !isPaid) {`
);

fs.writeFileSync('src/components/AuthPage.tsx', code);
console.log("Patched AuthPage to bypass verification for paid users");
