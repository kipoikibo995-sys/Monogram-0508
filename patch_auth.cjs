const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldAuth = `const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {`;

const newAuth = `const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && !currentUser.emailVerified) {
        setUser(null);
        return;
      }
      setUser(currentUser);
      if (currentUser) {`;

code = code.replace(oldAuth, newAuth);
fs.writeFileSync('src/App.tsx', code);

let authCode = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

const oldSignup = `await sendEmailVerification(userCredential.user);
        
        setSuccessMsg('Sign up successful! Please check your email to verify.');`;

const newSignup = `await sendEmailVerification(userCredential.user);
        
        await auth.signOut();
        
        setSuccessMsg('Sign up successful! Please check your email to verify.');`;

authCode = authCode.replace(oldSignup, newSignup);
fs.writeFileSync('src/components/AuthPage.tsx', authCode);
console.log("Patched");
