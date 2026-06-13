'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Key, User as UserIcon, UserPlus } from 'lucide-react';

function SignupContent() {
  const { signUp, user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      setSubmitting(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);
    if (error) {
      setErrorMsg(error.message || 'Registration failed. Please check inputs.');
      setSubmitting(false);
    } else {
      router.push(redirectUrl);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 grid-bg">
      <div className="max-w-md w-full border border-border bg-card p-8 sm:p-10 rounded shadow-xl space-y-6">
        
        {/* Title */}
        <div className="text-center">
          <span className="inline-block border border-accent/40 text-accent text-[9px] font-mono font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-3 bg-accent/5">
            NEW ACCOUNT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            REGISTER
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1.5">
            Join ZELIX to save collections & trace purchases
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-red-950/15 border border-red-500/20 text-error text-xs rounded p-4 font-mono">
            {errorMsg}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                required 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded pl-10 pr-3 py-2.5 focus:outline-none focus:border-white transition-colors"
              />
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
          </div>

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
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Password</label>
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
            <p className="text-[10px] text-muted-foreground font-mono mt-1">Minimum 6 characters required.</p>
          </div>

          <button 
            type="submit" 
            disabled={submitting || isLoading}
            className="w-full inline-flex items-center justify-center gap-2 h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer pt-2"
          >
            {submitting ? (
              'Creating Account...'
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-xs text-muted-foreground uppercase tracking-wider font-mono pt-4">
          Already a member?{' '}
          <Link href={`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-white font-bold hover:underline">
            Login Now
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Loading gateway...</span>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
