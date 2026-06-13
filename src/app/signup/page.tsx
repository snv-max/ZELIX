'use client';

import React, { Suspense } from 'react';
import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

function SignupContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || searchParams.get('redirect_url') || '/account';

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 grid-bg">
      <div className="w-full max-w-md flex flex-col items-center">
        <SignUp 
          signInUrl="/login"
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
