const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { doc, setDoc, getDoc } from 'firebase/firestore';",
  "import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';"
);

const oldUseEffect = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
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
             setUserTier('free');
          } else {
             await setDoc(userRef, {
               lastLogin: Date.now(),
               email: currentUser.email,
               displayName: currentUser.displayName
             }, { merge: true });
             setUserTier(userSnap.data().tier || 'free');
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setUserTier('free');
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);`;

const newUseEffect = `  useEffect(() => {
    let unsubDoc: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
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
             setUserTier('free');
          } else {
             await setDoc(userRef, {
               lastLogin: Date.now(),
               email: currentUser.email,
               displayName: currentUser.displayName
             }, { merge: true });
          }

          unsubDoc = onSnapshot(userRef, (snap) => {
             if (snap.exists()) {
                setUserTier(snap.data().tier || 'free');
             }
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        setUserTier('free');
        if (unsubDoc) unsubDoc();
      }
      setLoadingAuth(false);
    });
    return () => {
      unsubscribeAuth();
      if (unsubDoc) unsubDoc();
    };
  }, []);`;

code = code.replace(oldUseEffect, newUseEffect);

fs.writeFileSync('src/App.tsx', code);
