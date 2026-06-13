'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Key, LogIn, ArrowLeft } from 'lucide-react';

function LoginContent() {
  const { signIn, signInWithOtp, verifyLoginOtp, verifyEmailOtp, signInWithGoogle, user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Suppress browser-internal abort errors from showing to users
  const isAbortError = (err: Error | null) =>
    err !== null && (err.name === 'AbortError' || (err.message || '').toLowerCase().includes('aborted'));

  const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');
  const [step, setStep] = useState<'login' | 'otp_verify' | 'signup_verify'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const redirectUrl = searchParams.get('redirect') || '/account';

  useEffect(() => {
    if (!isLoading && user && step === 'login') {
      router.push(redirectUrl);
    }
  }, [user, isLoading, redirectUrl, router, step]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const { error } = await signIn(email, password);
    if (error) {
      if (isAbortError(error)) {
        setErrorMsg('Connection interrupted. Please try again.');
        setSubmitting(false);
        return;
      }
      const msg = error.message || '';
      if (msg.toLowerCase().includes('confirm') || msg.toLowerCase().includes('verify')) {
        setStep('signup_verify');
        setSubmitting(false);
      } else {
        setErrorMsg('Invalid email or password.');
        setSubmitting(false);
      }
    } else {
      router.push(redirectUrl);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const { error } = await signInWithOtp(email);
    if (error) {
      if (isAbortError(error)) {
        setErrorMsg('Connection interrupted. Please try again.');
      } else {
        setErrorMsg(error.message || 'Failed to send verification code.');
      }
      setSubmitting(false);
    } else {
      setStep('otp_verify');
      setSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanValue) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    const char = cleanValue.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    if (index < 5 && char !== '') {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index] === '' && index > 0) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const cleanText = pastedData.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
    
    if (cleanText) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < Math.min(cleanText.length, 6); i++) {
        newDigits[i] = cleanText[i];
      }
      setOtpDigits(newDigits);
      const focusIndex = Math.min(cleanText.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits.');
      setSubmitting(false);
      return;
    }

    if (step === 'signup_verify') {
      const { error } = await verifyEmailOtp(email, code);
      if (error) {
        setErrorMsg(isAbortError(error) ? 'Connection interrupted. Please try again.' : (error.message || 'Invalid code. Please try again.'));
        setSubmitting(false);
      } else {
        router.push(redirectUrl);
      }
    } else if (step === 'otp_verify') {
      const { error } = await verifyLoginOtp(email, code);
      if (error) {
        setErrorMsg(isAbortError(error) ? 'Connection interrupted. Please try again.' : (error.message || 'Invalid code. Please try again.'));
        setSubmitting(false);
      } else {
        router.push(redirectUrl);
      }
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg('');
    setSubmitting(true);

    let error = null;
    if (step === 'signup_verify') {
      const res = await signIn(email, password);
      error = res.error;
    } else {
      const res = await signInWithOtp(email);
      error = res.error;
    }

    if (error && !error.message?.toLowerCase().includes('confirm')) {
      setErrorMsg(error.message || 'Failed to resend code.');
    } else {
      setResendCooldown(60);
    }
    setSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(isAbortError(error) ? 'Connection interrupted. Please try again.' : (error.message || 'Google authentication failed.'));
    }
  };

  if (isLoading && step === 'login') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 grid-bg">
      <div className="max-w-md w-full border border-border bg-card p-8 sm:p-10 rounded shadow-xl space-y-6">
        
        {step === 'login' ? (
          <>
            <div className="text-center">
              <span className="inline-block border border-accent/40 text-accent text-[9px] font-mono font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-3 bg-accent/5">
                MEMBER AREA
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                SIGN IN
              </h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1.5">
                Log in to manage orders, wishlist, and profiles
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-950/15 border border-red-500/20 text-error text-xs rounded p-4 font-mono">
                {errorMsg}
              </div>
            )}

            <div className="flex border-b border-border mb-2 pt-2">
              <button
                type="button"
                onClick={() => { setActiveTab('password'); setErrorMsg(''); }}
                className={`flex-1 pb-3 text-[10px] uppercase font-mono tracking-wider border-b-2 font-bold cursor-pointer transition-colors ${activeTab === 'password' ? 'border-white text-white' : 'border-transparent text-muted-foreground hover:text-white'}`}
              >
                Password System
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('otp'); setErrorMsg(''); }}
                className={`flex-1 pb-3 text-[10px] uppercase font-mono tracking-wider border-b-2 font-bold cursor-pointer transition-colors ${activeTab === 'otp' ? 'border-white text-white' : 'border-transparent text-muted-foreground hover:text-white'}`}
              >
                OTP Code Login
              </button>
            </div>

            {activeTab === 'password' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded pl-10 pr-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Password</label>
                    <Link 
                      href="/auth/reset-password" 
                      className="text-[10px] font-mono uppercase text-accent hover:underline animate-pulse"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded pl-10 pr-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                    />
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer pt-2"
                >
                  {submitting ? 'Authenticating...' : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded pl-10 pr-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer pt-2"
                >
                  {submitting ? 'Sending Code...' : 'Send OTP Code'}
                </button>
              </form>
            )}

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-[#0d0d11] px-4 text-[9px] font-mono uppercase text-muted-foreground tracking-widest">
                or continue with
              </span>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full inline-flex items-center justify-center gap-2.5 h-12 border border-border bg-transparent hover:bg-white/5 text-white font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.445-2.89-6.445-6.445s2.89-6.445 6.445-6.445c1.614 0 3.09.594 4.224 1.576l3.056-3.056C19.336 2.217 15.99 1 11.97 1 5.92 1 1 5.92 1 11.97s4.92 10.97 10.97 10.97c6.264 0 10.42-4.407 10.42-10.602 0-.693-.062-1.362-.18-2.053H12.24z" />
              </svg>
              Google Account
            </button>

            <p className="text-center text-xs text-muted-foreground uppercase tracking-wider font-mono">
              New member?{' '}
              <Link href={`/signup?redirect=${encodeURIComponent(redirectUrl)}`} className="text-white font-bold hover:underline">
                Register Account
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="text-center">
              <span className="inline-block border border-accent/40 text-accent text-[9px] font-mono font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-3 bg-accent/5">
                {step === 'signup_verify' ? 'CONFIRM YOUR EMAIL' : 'VERIFICATION REQUIRED'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                ENTER CODE
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {step === 'signup_verify' 
                  ? 'Your account needs verification. Please enter the 6-character code sent to '
                  : 'We sent a 6-character login code to '
                }
                <span className="text-white font-mono font-semibold">{email}</span>.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-950/15 border border-red-500/20 text-error text-xs rounded p-4 font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-between gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-14 bg-[#18181b]/50 border border-border text-center text-xl font-bold font-mono text-white rounded focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer pt-2"
              >
                {submitting ? 'Verifying...' : 'Verify & Sign In'}
              </button>
            </form>

            <div className="space-y-4 pt-2 text-center text-xs uppercase tracking-wider font-mono">
              <p className="text-muted-foreground">
                Didn't receive the code?{' '}
                {resendCooldown > 0 ? (
                  <span className="text-zinc-500">Resend in {resendCooldown}s</span>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-white font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline-block align-baseline uppercase"
                  >
                    Resend Code
                  </button>
                )}
              </p>
              
              <button
                onClick={() => {
                  setStep('login');
                  setErrorMsg('');
                  setOtpDigits(Array(6).fill(''));
                }}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-white cursor-pointer bg-transparent border-none p-0 uppercase"
              >
                <ArrowLeft className="h-3 w-3" />
                Go Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Loading gateway...</span>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
