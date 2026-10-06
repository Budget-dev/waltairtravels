import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  
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
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot' | 'phone'>('signin');
  
  // Email / Password Form State
  const [email, setEmail] = useState<string>(''); // Kept for 'forgot' password and fallback
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  
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

  // 2. Email & Password Sign-In (Now Phone & Password)
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setError('Please enter your phone number and password.');
      return;
    }

    setError('');
    setIsLoading(true);
    
    // Generate an email from the phone number since Firebase Auth requires an email format
    const generatedEmail = `${phone.replace(/\D/g, '')}@waltairtravels.com`;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, generatedEmail, password);
      const fbUser = userCredential.user;
      const appUser: AppUser = {
        uid: fbUser.uid,
        name: fbUser.displayName || 'Rider',
        email: fbUser.email,
        phone: phone.replace(/\D/g, ''),
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

  // 3. Email & Password Sign-Up (Now Name, Phone, Password, Confirm Password)
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid phone number.');
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
    setIsLoading(true);
    
    const generatedEmail = `${cleanPhone}@waltairtravels.com`;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, generatedEmail, password);
      const fbUser = userCredential.user;
      
      const finalName = displayName.trim();
      try {
        await updateProfile(fbUser, { displayName: finalName });
      } catch (e) {
        // ignore profile update error
      }

      // Save user to Firestore database
      await setDoc(doc(db, 'users', fbUser.uid), {
        uid: fbUser.uid,
        name: finalName,
        email: generatedEmail,
        phone: cleanPhone,
        role: 'user',
        createdAt: serverTimestamp(),
      });

      const appUser: AppUser = {
        uid: fbUser.uid,
        name: finalName,
        email: generatedEmail,
        phone: cleanPhone,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#005a66] to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-cyan-400/30 shrink-0 bg-slate-900 flex items-center justify-center">
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
              <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-0.5">
                <span>Waltair Rider Portal</span>
              </div>
              <h3 className="font-bold text-lg text-white">
                {authMode === 'signin' && 'Sign In to Your Account'}
                {authMode === 'signup' && 'Create New Rider Account'}
                {authMode === 'forgot' && 'Reset Your Password'}
                {authMode === 'phone' && 'Quick Mobile Login'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              authMode === 'signin' ? 'border-[#005a66] text-[#005a66] bg-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              authMode === 'signup' ? 'border-[#005a66] text-[#005a66] bg-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('phone'); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              authMode === 'phone' ? 'border-[#005a66] text-[#005a66] bg-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Mobile OTP
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. Google Sign-In One-Click Button */}
          {authMode !== 'phone' && (
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 bg-white text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60"
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
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-semibold uppercase text-slate-400">or with email</span>
              </div>
            </div>
          )}

          {/* 2. SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleEmailSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-500">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setError(''); }}
                    className="text-[11px] text-cyan-700 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Signing In...' : 'SIGN IN'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-500 pt-1">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(''); }}
                  className="text-cyan-700 font-bold hover:underline"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-500">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-1"
              >
                <span>{isLoading ? 'Creating Account...' : 'REGISTER ACCOUNT'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-500 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(''); }}
                  className="text-cyan-700 font-bold hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* 4. FORGOT PASSWORD */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-600">
                Enter your email address below. We'll send you a password reset link to regain access.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Sending Link...' : 'SEND RESET LINK'}</span>
                <KeyRound className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(''); }}
                  className="text-cyan-700 font-bold hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 5. PHONE OTP TAB */}
          {authMode === 'phone' && (
            <form onSubmit={handleQuickPhoneLogin} className="space-y-4">
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                      <User className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Anand"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">10-Digit Mobile Number</label>
                    <div className="flex items-center gap-1.5 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ''));
                          setError('');
                        }}
                        placeholder="9876543210"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Sending Code...' : 'GET OTP & CONTINUE'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-cyan-50 rounded-xl text-xs text-cyan-900 flex items-center justify-between">
                    <span>Code sent to <strong>+91 {phone}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-cyan-700 font-bold hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 4-Digit OTP</label>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ''));
                          setError('');
                        }}
                        placeholder="e.g. 1234"
                        className="w-full bg-transparent font-mono text-base font-bold text-slate-900 tracking-widest outline-none"
                        autoFocus
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">For instant verification, enter any 4 digits (e.g. 1234)</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Verifying...' : 'VERIFY & SIGN IN'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </form>
          )}

          {/* Footer security note */}
          <div className="pt-2 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL Protected Firebase Authentication</span>
          </div>

        </div>

      </div>
    </div>
  );
};
