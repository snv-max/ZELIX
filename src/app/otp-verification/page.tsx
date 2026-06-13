'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSignUp } from '@/context/AuthContext';
import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useMockAuthHelper } from '@/context/AuthContext';

export default function OTPVerificationPage() {
  const { isLoaded, signUp, setActive } = useSignUp() as any;
  const mockAuth = useMockAuthHelper();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [cooldown, setCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer logic
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Focus utility
  const focusInput = (index: number) => {
    if (inputsRef.current[index]) {
      inputsRef.current[index]?.focus();
    }
  };

  // Handle key input
  const handleChange = (value: string, index: number) => {
    // Keep only alphanumeric characters
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    // Auto-focus next input if a character was entered
    if (cleanValue && index < 5) {
      focusInput(index + 1);
    }
  };

  // Handle backspace or delete keys
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Current slot is empty, delete previous slot and focus it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        focusInput(index - 1);
      } else {
        // Delete current slot
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
      e.preventDefault();
    }
  };

  // Handle pasting code (e.g. 123456)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/[^a-zA-Z0-9]/g, '');
    const codeChars = pasteData.slice(0, 6).split('');
    
    const newOtp = [...otp];
    codeChars.forEach((char, idx) => {
      newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus last character entered or final slot
    const focusIdx = Math.min(codeChars.length, 5);
    focusInput(focusIdx);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = otp.join('');
    if (verificationCode.length < 6) {
      setError('Please fill in all 6 slots.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLoaded && signUp) {
        // Attempt custom verification using Clerk's signup object
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: verificationCode,
        });

        if (completeSignUp.status === 'complete') {
          await setActive({ session: completeSignUp.createdSessionId });
          setSuccess(true);
        } else {
          setError('Verification failed. Status: ' + completeSignUp.status);
        }
      } else {
        // Mock fallback simulation
        console.log('Clerk not active. Simulating OTP code verification.');
        
        // Complete mock registration
        const tempEmail = localStorage.getItem('zelix_temp_email') || 'customer@zelix.com';
        const tempName = localStorage.getItem('zelix_temp_name') || 'Zelix Member';
        if (mockAuth) {
          mockAuth.signInMock(tempEmail, 'customer');
          if (tempName) {
            localStorage.setItem('zelix_mock_name', tempName);
          }
        }
        
        // Clean up temp details
        localStorage.removeItem('zelix_temp_email');
        localStorage.removeItem('zelix_temp_name');

        setSuccess(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.longMessage || err.message || 'Incorrect verification code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    setCooldown(60);
    setOtp(Array(6).fill(''));
    
    try {
      if (isLoaded && signUp) {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      } else {
        console.log('Clerk not active. Resent simulated email code.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || 'Resend failed. Try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 grid-bg">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Back Link */}
        <div className="w-full mb-6 text-left">
          <Link href="/signup" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign Up
          </Link>
        </div>

        <div className="w-full glass p-8 rounded border border-border shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="h-10 w-10 border border-zinc-700 rounded flex items-center justify-center mx-auto mb-4 font-mono text-sm text-white font-bold animate-pulse">
              [OTP]
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white animate-fade-in">
              Verify Account
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-950/20 border border-rose-950/50 rounded text-rose-400 text-xs font-mono">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center space-y-6">
              <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-sm text-zinc-300 font-mono">
                Verification complete! Account activated.
              </p>
              <Link 
                href="/account"
                className="w-full h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                Go to Account
              </Link>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-8">
              
              {/* 6-Digit input grid */}
              <div className="flex justify-between gap-2.5">
                {otp.map((char, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={char}
                    ref={el => { inputsRef.current[index] = el; }}
                    onChange={e => handleChange(e.target.value, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-12 h-14 bg-zinc-900/60 border border-border text-center text-xl font-bold font-mono text-white rounded focus:outline-none focus:border-white transition-colors"
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500"
                >
                  {loading ? 'Verifying Code...' : 'Verify OTP'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-zinc-400 hover:text-white transition-colors disabled:text-zinc-600 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${cooldown === 0 ? 'animate-spin-slow' : ''}`} />
                    Resend Code {cooldown > 0 ? `(${cooldown}s)` : ''}
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

        {/* Security Info */}
        <div className="w-full mt-6 border border-border bg-[#0d0d11]/40 p-4 rounded flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <ShieldCheck className="h-4.5 w-4.5 text-white shrink-0" />
          <span>OTP dispatching is secured by Clerk systems.</span>
        </div>

      </div>
    </div>
  );
}
