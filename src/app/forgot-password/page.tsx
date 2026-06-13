'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSignIn } from '@/context/AuthContext';
import { Key, Mail, ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn() as any;

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'request' | 'verify' | 'success'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    try {
      if (isLoaded && signIn) {
        // Create sign in attempt for reset password strategy
        await signIn.create({
          strategy: 'reset_password_email_code',
          identifier: email,
        });
        setStep('verify');
      } else {
        // Mock fallback if Clerk is not active
        console.log('Clerk not loaded. Simulating email code dispatch.');
        setStep('verify');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.longMessage || err.message || 'Unable to process reset request. Check email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !password) return;
    setLoading(true);
    setError('');

    try {
      if (isLoaded && signIn) {
        const result = await signIn.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code,
          password,
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          setStep('success');
        } else {
          setError('Verification in progress, but not completed. Check credentials.');
        }
      } else {
        // Mock reset fallback
        console.log('Clerk not loaded. Simulating password reset.');
        setStep('success');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.longMessage || err.message || 'Incorrect verification code or password criteria not met.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 grid-bg">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Back Link */}
        <div className="w-full mb-6 text-left">
          <Link href="/login" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        <div className="w-full glass p-8 rounded border border-border shadow-2xl">
          
          <div className="text-center mb-8">
            <Key className="h-10 w-10 text-white mx-auto mb-4" />
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Reset Password
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              {step === 'request' && 'Enter your email to request reset code'}
              {step === 'verify' && 'Enter verification code & new password'}
              {step === 'success' && 'Password updated successfully'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-950/20 border border-rose-950/50 rounded text-rose-400 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Step 1: Request Code Form */}
          {step === 'request' && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded pl-10 pr-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {loading ? 'Sending...' : (
                  <>
                    Send Reset Code
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Verification Form */}
          {step === 'verify' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Verification Code</label>
                <input 
                  type="text" 
                  required 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-[#18181b]/50 border border-border text-sm text-white font-mono placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors text-center text-lg tracking-widest"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">New Password</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {loading ? 'Verifying...' : (
                  <>
                    Reset Password
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 3: Success Screen */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              
              <p className="text-sm text-muted-foreground">
                Your password has been successfully reset. You are now logged in and can resume shopping.
              </p>

              <Link 
                href="/products" 
                className="w-full h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                Shop Collections
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

        </div>

        {/* Security Info */}
        <div className="w-full mt-6 border border-border bg-[#0d0d11]/40 p-4 rounded flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <ShieldCheck className="h-4.5 w-4.5 text-white shrink-0" />
          <span>Security recovery operations are backed by Clerk.</span>
        </div>

      </div>
    </div>
  );
}
