'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Key, Sparkles, LogIn } from 'lucide-react';

function LoginContent() {
  const { signIn, signInWithGoogle, user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

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

    const { error } = await signIn(email, password);
    if (error) {
      setErrorMsg(error.message || 'Invalid email or password credentials.');
      setSubmitting(false);
    } else {
      router.push(redirectUrl);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message || 'Google authentication failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 grid-bg">
      <div className="max-w-md w-full border border-border bg-card p-8 sm:p-10 rounded shadow-xl space-y-6">
        
        {/* Title */}
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

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-red-950/15 border border-red-500/20 text-error text-xs rounded p-4 font-mono">
            {errorMsg}
          </div>
        )}

        {/* Credentials Form */}
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
                className="text-[10px] font-mono uppercase text-accent hover:underline"
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
            disabled={submitting || isLoading}
            className="w-full inline-flex items-center justify-center gap-2 h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer"
          >
            {submitting ? (
              'Authenticating...'
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-[#0d0d11] px-4 text-[9px] font-mono uppercase text-muted-foreground tracking-widest">
            or continue with
          </span>
        </div>

        {/* Social SSO Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full inline-flex items-center justify-center gap-2.5 h-12 border border-border bg-transparent hover:bg-white/5 text-white font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.445-2.89-6.445-6.445s2.89-6.445 6.445-6.445c1.614 0 3.09.594 4.224 1.576l3.056-3.056C19.336 2.217 15.99 1 11.97 1 5.92 1 1 5.92 1 11.97s4.92 10.97 10.97 10.97c6.264 0 10.42-4.407 10.42-10.602 0-.693-.062-1.362-.18-2.053H12.24z" />
          </svg>
          Google Account
        </button>

        {/* Footer link */}
        <p className="text-center text-xs text-muted-foreground uppercase tracking-wider font-mono">
          New member?{' '}
          <Link href={`/auth/signup?redirect=${encodeURIComponent(redirectUrl)}`} className="text-white font-bold hover:underline">
            Register Account
          </Link>
        </p>

        {/* Demo instructions */}
        <div className="border border-border/60 bg-[#0d0d11]/40 p-4 rounded text-[10px] font-mono text-muted-foreground leading-relaxed">
          <div className="flex gap-2 items-start">
            <Sparkles className="h-4 w-4 text-white shrink-0" />
            <p>
              <strong>Demo Credentials:</strong><br />
              • Customer: <code>customer@zelix.com</code> (Any pass)<br />
              • Admin Dashboard: <code>admin@zelix.com</code> (Any pass)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin animate-fade-in" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Loading gateway...</span>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
