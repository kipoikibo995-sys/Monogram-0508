const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importSync = `import { doc, setDoc } from 'firebase/firestore';\nimport { db } from './firebase';`;
code = code.replace("import { auth } from './firebase';", "import { auth } from './firebase';\n" + importSync);

const authStateSync = `    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await setDoc(doc(db, 'users', currentUser.uid), {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            lastLogin: Date.now(),
            // Only set default values if creating, usually use merge or a separate function
          }, { merge: true });
        } catch (e) {
          console.error(e);
        }
      }
      setLoadingAuth(false);
    });`;

code = code.replace(/    const unsubscribe = onAuthStateChanged\(auth, \(currentUser\) => \{[\s\S]*?    \}\);/, authStateSync);
fs.writeFileSync('src/App.tsx', code);
