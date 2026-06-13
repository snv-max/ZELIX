'use client';

import React, { useState, Suspense } from 'react';
import { SignIn } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { isClerkConfigured, useMockAuthHelper } from '@/context/AuthContext';
import { Mail, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get('redirect') || searchParams.get('redirect_url') || '/account';

  const mockAuth = useMockAuthHelper();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    
    // Simulate slight server latency for realistic feel
    setTimeout(() => {
      if (mockAuth) {
        mockAuth.signInMock(email, role);
        setLoading(false);
        router.push(redirectUrl);
      }
    }, 800);
  };

  // 1. Render Clerk SignIn if Clerk is active
  if (isClerkConfigured) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 grid-bg">
        <div className="w-full max-w-md flex flex-col items-center">
          <SignIn 
            signUpUrl="/signup"
            forceRedirectUrl={redirectUrl}
            appearance={{
              elements: {
                card: "bg-card border border-border shadow-xl rounded",
                headerTitle: "text-white uppercase font-black tracking-tight",
                headerSubtitle: "text-xs text-muted-foreground uppercase tracking-widest mt-1",
                socialButtonsBlockButton: "border border-border bg-transparent hover:bg-white/5 text-white text-xs uppercase tracking-widest font-bold h-12 transition-all rounded",
                socialButtonsBlockButtonText: "text-white font-bold",
                formButtonPrimary: "w-full h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors pt-2",
                formFieldLabel: "text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block",
                formFieldInput: "w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded py-2.5 focus:outline-none focus:border-white transition-colors",
                footerActionLink: "text-white font-bold hover:underline",
                footerActionText: "text-xs text-muted-foreground uppercase tracking-wider font-mono",
                dividerText: "bg-[#0d0d11] text-[9px] font-mono uppercase text-muted-foreground tracking-widest",
                identityPreviewText: "text-white",
                formResendCodeLink: "text-white font-bold hover:underline",
                otpCodeFieldInput: "bg-[#18181b]/50 border border-border text-white text-xl font-bold font-mono rounded",
              }
            }}
          />
        </div>
      </div>
    );
  }

  // 2. Render Mock Login for local auditing
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 grid-bg animate-fade-in">
      <div className="w-full max-w-md">
        <div className="glass p-8 rounded border border-border shadow-2xl space-y-8">
          
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">
              ZELIX ACCESS
            </h2>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-2">
              Auditor Mock Login Gateway
            </p>
          </div>

          <form onSubmit={handleMockLogin} className="space-y-6">
            
            {/* Email input */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@zelix.com, admin@zelix.com"
                  className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded pl-10 pr-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            {/* Role select */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Fulfillment Access Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => {
                    const newRole = e.target.value as any;
                    setRole(newRole);
                    if (newRole === 'admin' && !email) {
                      setEmail('admin@zelix.com');
                    } else if (newRole === 'customer' && !email) {
                      setEmail('customer@zelix.com');
                    }
                  }}
                  className="w-full bg-[#18181b]/50 border border-border text-sm text-white rounded pl-10 pr-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                >
                  <option value="customer">Customer Access (Shopping, orders, tracking)</option>
                  <option value="admin">Administrator (Garments CRUD, order statuses)</option>
                </select>
                <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            {/* Predefined Quick logins */}
            <div className="pt-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">Quick Access Shortcuts</span>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => { setEmail('customer@zelix.com'); setRole('customer'); }}
                  className="flex-1 text-[10px] font-mono py-2 border border-border hover:border-white/20 bg-zinc-950/20 text-zinc-300 hover:text-white rounded transition-all"
                >
                  Customer Demo
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('admin@zelix.com'); setRole('admin'); }}
                  className="flex-1 text-[10px] font-mono py-2 border border-border hover:border-white/20 bg-zinc-950/20 text-zinc-300 hover:text-white rounded transition-all"
                >
                  Admin Panel Demo
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              {loading ? 'Entering Gateway...' : (
                <>
                  Enter Gateway
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Security Info */}
        <div className="w-full mt-6 border border-border bg-[#0d0d11]/40 p-4 rounded flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <ShieldCheck className="h-4.5 w-4.5 text-white shrink-0" />
          <span>Local mock auth active. Clerk config key was not verified.</span>
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
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Loading gateway...</span>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
