const fs = require('fs');
let code = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

code = code.replace(
  /await sendEmailVerification\(userCredential\.user\);\n\s*await auth\.signOut\(\);\n\s*setSuccessMsg\('Sign up successful! Please check your email to verify\.'\);\n\s*setIsLogin\(true\);/,
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

        if (!isPaid) {
          await sendEmailVerification(userCredential.user);
          await auth.signOut();
          setSuccessMsg('Sign up successful! Please check your email to verify.');
          setIsLogin(true);
        } else {
          // IPN paid user, no email verification needed, let them log in directly
          // We don't sign them out, so App.tsx onAuthStateChanged will handle it
        }
  `
);

fs.writeFileSync('src/components/AuthPage.tsx', code);
console.log("Patched AuthPage signup logic");
