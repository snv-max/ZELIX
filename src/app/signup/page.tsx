'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

function SignupContent() {
  const { signUp, user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/account';

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, isLoading, redirectUrl, router]);

  const handleAuth0Signup = async () => {
    setErrorMsg('');
    setSubmitting(true);
    const { error } = await signUp();
    if (error) {
      setErrorMsg(error.message || 'Authentication redirect failed.');
      setSubmitting(false);
    }
  };

  if (isLoading) {
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
        <div className="text-center">
          <span className="inline-block border border-accent/40 text-accent text-[9px] font-mono font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-3 bg-accent/5">
            MEMBER AREA
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            REGISTER
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1.5">
            Create an account to track orders and save details
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/15 border border-red-500/20 text-error text-xs rounded p-4 font-mono text-center">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4 pt-4">
          <button 
            onClick={handleAuth0Signup}
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer pt-2"
          >
            <UserPlus className="h-4 w-4" />
            {submitting ? 'Redirecting to Auth0...' : 'Sign Up with Auth0'}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground uppercase tracking-wider font-mono pt-2">
          Already a member?{' '}
          <Link href={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-white font-bold hover:underline">
            Sign In
          </Link>
        </p>

        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-wider font-mono pt-2 leading-relaxed">
          Secured by Auth0 Identity Services. All passwords, OAuth connections, and MFA codes are processed off-site for maximum security.
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
