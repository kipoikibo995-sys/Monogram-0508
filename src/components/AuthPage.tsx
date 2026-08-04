import React, { useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Math Captcha state
  const [captchaNum1, setCaptchaNum1] = useState(Math.floor(Math.random() * 10) + 1);
  const [captchaNum2, setCaptchaNum2] = useState(Math.floor(Math.random() * 10) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const getErrorMessage = (err: any) => {
    console.error("Auth Error:", err);
    switch (err.code) {
      case 'auth/email-already-in-use':
        return 'This email is already in use. Please log in or use another email.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return err.message || 'An error occurred. Please try again later.';
    }
  };

  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaAnswer('');
  };

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters.";
    if (!/[a-z]/.test(pass)) return "Password must contain at least 1 lowercase letter.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least 1 uppercase letter.";
    if (!/[0-9]/.test(pass)) return "Password must contain at least 1 number.";
    if (!/[\W_]/.test(pass)) return "Password must contain at least 1 special character.";
    return null;
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!isLogin) {
        if (parseInt(captchaAnswer) !== captchaNum1 + captchaNum2) {
          setError('Incorrect math answer.');
          setLoading(false);
          return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        
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
  
        setPassword('');
        setCaptchaAnswer('');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
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
  
          setError('Please verify your email before logging in.');
          await auth.signOut();
          setLoading(false);
          return;
        }
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      generateCaptcha();
    }
  };

  const handleResendVerification = async () => {
    if (!email || !password) {
      setError('Please enter your email and password to resend verification.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
        await sendEmailVerification(userCredential.user);
        setSuccessMsg('Verification email resent. Please check your inbox.');
        await auth.signOut();
      } else {
        setSuccessMsg('Email is already verified. You can log in.');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex relative items-center justify-center lg:justify-end p-4 sm:p-8 lg:pr-24 xl:pr-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://res.cloudinary.com/mekoxs1q/image/upload/v1785650494/ChatGPT_Image_Aug_2_2026_12_59_34_PM_nelckl.png" 
          alt="KDP MonoCrafter Cover" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Login Section */}
      <div className="w-full max-w-md flex flex-col items-center p-8 sm:p-10 z-10 relative">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-neutral-900 mb-2 tracking-tight">KDP MonoCrafter</h1>
          <p className="text-neutral-600 font-medium">{isLogin ? 'Sign in to start creating' : 'Create an account to start'}</p>
        </div>
          
        

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                required
                placeholder="Display Name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
            />
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">
                Security Check: {captchaNum1} + {captchaNum2} = ?
              </label>
              <input
                type="number"
                required
                placeholder="Enter the result"
                value={captchaAnswer}
                onChange={e => setCaptchaAnswer(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
              />
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 font-medium text-center">
              {error}
              {error.includes('verify your email') && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="block mt-2 mx-auto text-red-700 underline hover:text-red-800"
                >
                  Resend verification email
                </button>
              )}
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-sm text-green-600 bg-green-50 rounded-xl border border-green-100 font-medium text-center">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-black transition-colors disabled:opacity-70 active:scale-[0.98]"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        <div className="relative flex items-center justify-center mt-6 mb-6 w-full">
          <span className="absolute bg-white px-3 text-sm text-neutral-500 font-medium">or</span>
          <div className="w-full border-t border-neutral-200"></div>
        </div>
        
        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-200 rounded-xl py-3.5 font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all hover:shadow-sm disabled:opacity-50 active:scale-[0.98]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.1-1.93 3.31-4.78 3.31-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>


        <p className="text-center text-sm text-neutral-600 mt-8">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); generateCaptcha(); }}
            className="ml-1 text-neutral-900 font-bold hover:underline"
          >
            {isLogin ? 'Request access here.' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}

