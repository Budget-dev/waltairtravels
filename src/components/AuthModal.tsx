import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail,
  db,
  doc,
  setDoc,
  serverTimestamp
} from '../firebase';
import { AppUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AppUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  // Form State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const getCleanErrorMessage = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'Invalid email or password. Please check your credentials.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (code === 'auth/weak-password') {
      return 'Password should be at least 6 characters long.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Google sign-in popup was closed before completion.';
    }
    if (code === 'auth/cancelled-popup-request') {
      return 'Only one popup request allowed at a time.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection issue. Please check your internet connection.';
    }
    return err?.message || 'Authentication error. Please try again.';
  };

  // 1. Google Direct Sign-In
  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const appUser: AppUser = {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Rider',
        email: fbUser.email,
        phone: fbUser.phoneNumber || undefined,
        photoURL: fbUser.photoURL,
        isLoggedIn: true,
      };

      try {
        await setDoc(
          doc(db, 'users', fbUser.uid),
          {
            uid: fbUser.uid,
            name: appUser.name,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            role: 'user',
            lastLoginAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (dbErr) {
        console.warn('Firestore user profile sync note:', dbErr);
      }

      localStorage.setItem('waltair_user_session', JSON.stringify(appUser));
      window.dispatchEvent(new Event('waltair_auth_change'));
      onLoginSuccess(appUser);
      onClose();
    } catch (err: any) {
      console.warn('Google Auth note:', err);
      setError(getCleanErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Email & Password Sign-In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;
      const appUser: AppUser = {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Rider',
        email: fbUser.email,
        phone: fbUser.phoneNumber || undefined,
        photoURL: fbUser.photoURL,
        isLoggedIn: true,
      };

      try {
        await setDoc(
          doc(db, 'users', fbUser.uid),
          {
            uid: fbUser.uid,
            name: appUser.name,
            email: fbUser.email,
            lastLoginAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (dbErr) {
        console.warn('Firestore user profile sync note:', dbErr);
      }

      localStorage.setItem('waltair_user_session', JSON.stringify(appUser));
      window.dispatchEvent(new Event('waltair_auth_change'));
      onLoginSuccess(appUser);
      onClose();
    } catch (err: any) {
      setError(getCleanErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Email & Password Sign-Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;
      const finalName = displayName.trim();

      try {
        await updateProfile(fbUser, { displayName: finalName });
      } catch (profileErr) {
        console.warn('Profile update note:', profileErr);
      }

      try {
        await setDoc(doc(db, 'users', fbUser.uid), {
          uid: fbUser.uid,
          name: finalName,
          email: email.trim(),
          role: 'user',
          createdAt: serverTimestamp(),
        });
      } catch (dbErr) {
        console.warn('Firestore user profile creation note:', dbErr);
      }

      const appUser: AppUser = {
        uid: fbUser.uid,
        name: finalName,
        email: email.trim(),
        phone: undefined,
        photoURL: fbUser.photoURL,
        isLoggedIn: true,
      };
      localStorage.setItem('waltair_user_session', JSON.stringify(appUser));
      window.dispatchEvent(new Event('waltair_auth_change'));
      onLoginSuccess(appUser);
      onClose();
    } catch (err: any) {
      setError(getCleanErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Password Reset
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMessage('Password reset link has been sent to your email.');
      setTimeout(() => {
        setSuccessMessage('');
        setAuthMode('signin');
      }, 4000);
    } catch (err: any) {
      setError(getCleanErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[390px] sm:max-w-[420px] rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden relative my-auto">
        
        {/* Compact Classy Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-teal-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-xs border border-teal-400/30 shrink-0 bg-slate-900 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Waltair Travels" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://waltairtravelsandcabs.sirv.com/Glossy%20WT%20Road%20Trip%20App%20Icon.png';
                }}
              />
            </div>
            <div>
              <div className="text-[10px] text-teal-300 font-bold uppercase tracking-wider leading-none mb-0.5">
                Waltair Rider Portal
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white leading-tight">
                {authMode === 'signin' && 'Sign In to Your Account'}
                {authMode === 'signup' && 'Create Rider Account'}
                {authMode === 'forgot' && 'Reset Your Password'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close authentication modal"
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Segmented Control: Sign In & Sign Up */}
        {authMode !== 'forgot' && (
          <div className="px-4 pt-3 sm:px-5 sm:pt-3.5">
            <div className="flex p-0.5 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  authMode === 'signin' 
                    ? 'bg-white text-teal-900 shadow-xs font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  authMode === 'signup' 
                    ? 'bg-white text-teal-900 shadow-xs font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3">
          
          {/* Error Alert */}
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Direct Sign-In Button */}
          {authMode !== 'forgot' && (
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 bg-white text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-2.5 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-2.5 text-[10px] font-semibold uppercase text-slate-400">
                  {authMode === 'signin' ? 'or sign in with email' : 'or register with email'}
                </span>
              </div>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleEmailSignIn} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Email Address</label>
                <div className="flex items-center gap-2 px-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 focus-within:border-teal-600 bg-slate-50 focus-within:bg-white transition-colors">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <label className="text-[11px] font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setError(''); }}
                    className="text-[10px] text-teal-700 hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 focus-within:border-teal-600 bg-slate-50 focus-within:bg-white transition-colors">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 sm:py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 mt-1"
              >
                <span>{isLoading ? 'Signing In...' : 'SIGN IN'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center text-[11px] text-slate-500 pt-0.5">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(''); }}
                  className="text-teal-800 font-bold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* 2. SIGN UP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleEmailSignUp} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Full Name</label>
                <div className="flex items-center gap-2 px-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 focus-within:border-teal-600 bg-slate-50 focus-within:bg-white transition-colors">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Email Address</label>
                <div className="flex items-center gap-2 px-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 focus-within:border-teal-600 bg-slate-50 focus-within:bg-white transition-colors">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Password</label>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 focus-within:border-teal-600 bg-slate-50 focus-within:bg-white transition-colors">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-transparent text-xs text-slate-900 outline-none"
                      autoComplete="new-password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Confirm</label>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 focus-within:border-teal-600 bg-slate-50 focus-within:bg-white transition-colors">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat"
                      className="w-full bg-transparent text-xs text-slate-900 outline-none"
                      autoComplete="new-password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 sm:py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 mt-1"
              >
                <span>{isLoading ? 'Creating Account...' : 'REGISTER ACCOUNT'}</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>

              <div className="text-center text-[11px] text-slate-500 pt-0.5">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(''); }}
                  className="text-teal-800 font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your registered email address below. We'll send you a password reset link.
              </p>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Registered Email</label>
                <div className="flex items-center gap-2 px-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 focus-within:border-teal-600 bg-slate-50 focus-within:bg-white transition-colors">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 sm:py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Sending Link...' : 'SEND RESET LINK'}</span>
                <KeyRound className="w-3.5 h-3.5" />
              </button>

              <div className="text-center text-[11px] text-slate-500 pt-0.5">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(''); }}
                  className="text-teal-800 font-bold hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Compact Footer Security Note */}
          <div className="pt-1 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>256-bit SSL Protected Firebase Authentication</span>
          </div>

        </div>

      </div>
    </div>
  );
};
