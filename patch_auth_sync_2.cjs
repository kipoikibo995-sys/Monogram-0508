const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const authStateSync = `    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const { doc, getDoc, setDoc } = require('firebase/firestore');
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
             await setDoc(userRef, {
               uid: currentUser.uid,
               email: currentUser.email,
               displayName: currentUser.displayName,
               createdAt: Date.now(),
               lastLogin: Date.now(),
               status: 'active',
               tier: 'free',
               purchases: []
             });
          } else {
             await setDoc(userRef, {
               lastLogin: Date.now(),
               email: currentUser.email,
               displayName: currentUser.displayName
             }, { merge: true });
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoadingAuth(false);
    });`;

code = code.replace(/    const unsubscribe = onAuthStateChanged\(auth, async \(currentUser\) => \{[\s\S]*?    \}\);/, authStateSync);
fs.writeFileSync('src/App.tsx', code);
