'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Mail, Check, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const { error } = await resetPassword(email);
    if (error) {
      setErrorMsg(error.message || 'Error requesting password reset.');
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 grid-bg">
      <div className="max-w-md w-full border border-border bg-card p-8 sm:p-10 rounded shadow-xl space-y-6">
        
        {/* Title */}
        <div className="text-center">
          <span className="inline-block border border-accent/40 text-accent text-[9px] font-mono font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-3 bg-accent/5">
            SECURITY GATEWAY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            RECOVER PASSWORD
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1.5">
            Verify email to reset account access
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-red-950/15 border border-red-500/20 text-error text-xs rounded p-4 font-mono flex gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submitted ? (
          /* Success Message */
          <div className="space-y-6 text-center py-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="h-6 w-6" />
            </div>
            <p className="text-sm text-zinc-300">
              A recovery link has been dispatched to <strong>{email}</strong>. Please check your inbox and follow the guidelines to update your credentials.
            </p>
            <Link 
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-white hover:underline mt-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Return to login
            </Link>
          </div>
        ) : (
          /* Form request */
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

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer pt-2"
            >
              {submitting ? 'Sending Link...' : 'Send Recovery Link'}
            </button>

            {/* Back link */}
            <div className="text-center pt-2">
              <Link 
                href="/auth/login" 
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
