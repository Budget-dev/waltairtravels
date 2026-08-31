import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail
} from '../firebase';
import { AppUser } from '../types';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardAction, GlassCardContent, GlassCardFooter } from './ui/glass-card';

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
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot' | 'phone'>('signin');
  
  // Email / Password Form State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  

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

  // 1. Google Sign-In
  const handleGoogleSignIn = async () => {
    setError('');
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
      localStorage.setItem('waltair_user_session', JSON.stringify(appUser));
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
      localStorage.setItem('waltair_user_session', JSON.stringify(appUser));
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
    if (!email.trim() || !password.trim()) {
      setError('Please provide email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;
      
      const finalName = displayName.trim() || email.split('@')[0];
      if (finalName) {
        try {
          await updateProfile(fbUser, { displayName: finalName });
        } catch (e) {
          // ignore profile update error
        }
      }

      const appUser: AppUser = {
        uid: fbUser.uid,
        name: finalName,
        email: fbUser.email,
        phone: phone ? phone.replace(/\D/g, '') : undefined,
        photoURL: fbUser.photoURL,
        isLoggedIn: true,
      };
      localStorage.setItem('waltair_user_session', JSON.stringify(appUser));
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

  // 5. Quick Phone OTP Login Option
  const handleQuickPhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      const clean = phone.replace(/\D/g, '');
      if (clean.length < 10) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
      setError('');
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setOtpSent(true);
      }, 500);
    } else {
      if (otp.length < 4) {
        setError('Please enter the 4-digit verification code.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const appUser: AppUser = {
          uid: 'phone_' + phone.replace(/\D/g, ''),
          name: displayName.trim() || 'Rider',
          email: null,
          phone: phone.replace(/\D/g, ''),
          isLoggedIn: true,
        };
        localStorage.setItem('waltair_user_session', JSON.stringify(appUser));
        onLoginSuccess(appUser);
        onClose();
      }, 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md flex justify-center"
          >
            <GlassCard className="w-full">
        
        <GlassCardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Waltair Rider Portal</span>
            </div>
            <GlassCardTitle className="text-lg">
              {authMode === 'signin' && 'Sign In to Your Account'}
              {authMode === 'signup' && 'Create New Rider Account'}
              {authMode === 'forgot' && 'Reset Your Password'}
              
            </GlassCardTitle>
          </div>
          <GlassCardAction>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </GlassCardAction>
        </GlassCardHeader>

        {/* Tab switchers */}
        <div className="flex border-y border-white/10 bg-white/5 text-xs font-semibold mx-1">
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 cursor-pointer ${
              authMode === 'signin' ? 'border-cyan-400 text-cyan-400 bg-white/10 font-bold' : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 cursor-pointer ${
              authMode === 'signup' ? 'border-cyan-400 text-cyan-400 bg-white/10 font-bold' : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Sign Up
          </button>
          
        </div>

        <GlassCardContent className="pt-6 space-y-4">
          
          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. Google Sign-In One-Click Button */}
          {(true) && (
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-white/20 w-full"></div>
                <span className="bg-transparent px-3 text-[11px] font-semibold uppercase text-white/50 absolute">or with email</span>
              </div>
            </div>
          )}

          {/* 2. SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleEmailSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Email Address</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-white/20 focus-within:border-cyan-400 bg-white/5">
                  <Mail className="w-4 h-4 text-white/50 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-white/30 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-white/80">Password</label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setError(''); }}
                    className="text-[11px] text-cyan-400 hover:underline font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-white/20 focus-within:border-cyan-400 bg-white/5">
                  <Lock className="w-4 h-4 text-white/50 shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-white/30 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Signing In...' : 'SIGN IN'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-white/60 pt-1">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(''); }}
                  className="text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* 3. SIGN UP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleEmailSignUp} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Full Name</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-white/20 focus-within:border-cyan-400 bg-white/5">
                  <User className="w-4 h-4 text-white/50 shrink-0" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-white/30 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Email Address</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-white/20 focus-within:border-cyan-400 bg-white/5">
                  <Mail className="w-4 h-4 text-white/50 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-white/30 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Password (min 6 characters)</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-white/20 focus-within:border-cyan-400 bg-white/5">
                  <Lock className="w-4 h-4 text-white/50 shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-white/30 outline-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Phone Number</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-white/20 focus-within:border-cyan-400 bg-white/5">
                  <Phone className="w-4 h-4 text-white/50 shrink-0" />
                  <span className="text-xs font-bold text-white/40">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-white/30 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-1"
              >
                <span>{isLoading ? 'Creating Account...' : 'REGISTER ACCOUNT'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-white/60 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(''); }}
                  className="text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* 4. FORGOT PASSWORD */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <GlassCardDescription>
                Enter your email address below. We'll send you a password reset link to regain access.
              </GlassCardDescription>
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Registered Email</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-white/20 focus-within:border-cyan-400 bg-white/5">
                  <Mail className="w-4 h-4 text-white/50 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-white/30 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Sending Link...' : 'SEND RESET LINK'}</span>
                <KeyRound className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-white/60 pt-1">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(''); }}
                  className="text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 5. PHONE OTP TAB */}
          </GlassCardContent>
        <GlassCardFooter className="justify-center">
          {/* Footer security note */}
          <div className="text-[11px] text-white/40 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit SSL Protected Firebase Authentication</span>
          </div>
        </GlassCardFooter>
      </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
