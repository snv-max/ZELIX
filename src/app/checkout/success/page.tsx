'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  
  const sessionId = searchParams.get('session_id');
  const isMock = searchParams.get('mock') === 'true';

  // Clear cart upon arriving at success page
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background text-foreground grid-bg px-4 py-16">
      <div className="max-w-md w-full text-center border border-border bg-card p-10 rounded">
        
        {/* Animated Check Icon */}
        <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
          <CheckCircle className="h-10 w-10 text-emerald-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-2">
          ORDER CONFIRMED
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Thank you for shopping with ZELIX. Your payment was processed successfully, and your order is now being prepared for shipment.
        </p>

        {/* Order details box */}
        <div className="bg-zinc-950 border border-border p-4 rounded text-left font-mono text-xs space-y-2.5 mb-8">
          <div className="flex justify-between text-muted-foreground">
            <span>Status</span>
            <span className="text-emerald-400 font-bold uppercase">Paid & Confirmed</span>
          </div>
          <div className="flex justify-between text-muted-foreground gap-4">
            <span>Session ID</span>
            <span className="text-white truncate max-w-[200px]" title={sessionId || ''}>
              {sessionId || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Integration</span>
            <span className="text-white">{isMock ? 'Mock Simulation' : 'Live Stripe'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            href="/orders" 
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded py-4 hover:bg-zinc-200 transition-colors"
          >
            Track Order History
            <ShoppingBag className="h-4 w-4" />
          </Link>
          
          <Link 
            href="/products" 
            className="w-full inline-flex items-center justify-center gap-2 border border-border text-white text-xs uppercase tracking-widest font-bold rounded py-4 hover:bg-white/5 transition-all"
          >
            Continue Browsing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Resolving session...</span>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
