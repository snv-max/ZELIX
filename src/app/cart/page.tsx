'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUser } from '@clerk/nextjs';
import { Trash2, ShoppingBag, Plus, Minus, CreditCard, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQuantity, cartTotal } = useCart();
  const { user } = useUser();

  const handleProceedToCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background text-foreground grid-bg px-4">
        <div className="max-w-md w-full text-center border border-border bg-card p-10 rounded">
          <ShoppingBag className="h-12 w-12 text-zinc-700 mx-auto mb-6" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Your Bag is Empty</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Browse our catalog to explore premium heavyweight hoodies, tech cargos, futuristic visor shades, and cyber runners.
          </p>
          <Link 
            href="/products" 
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded py-4 hover:bg-zinc-200 transition-colors"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-8 sm:mb-12 border-b border-border pb-6">
          SHOPPING BAG
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-6">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-4 sm:gap-6 p-4 rounded bg-[#0d0d11]/80 border border-border/80"
              >
                
                {/* Product Image */}
                <div className="relative w-20 sm:w-28 aspect-[4/5] bg-zinc-950 rounded overflow-hidden shrink-0 border border-border/50">
                  <Image 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    fill 
                    className="object-cover" 
                    sizes="112px"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <Link href={`/products/${item.product.slug}`} className="text-sm sm:text-base font-bold text-white hover:underline line-clamp-1">
                        {item.product.name}
                      </Link>
                      <span className="text-sm sm:text-base font-bold text-white font-mono">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase font-mono text-muted-foreground mb-3">
                      {item.color && (
                        <span>Color: <strong className="text-zinc-300">{item.color}</strong></span>
                      )}
                      {item.size && (
                        <span>Size: <strong className="text-zinc-300">{item.size}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Trash */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 border border-border/80 rounded bg-black/40 px-2 py-1.5">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-muted-foreground hover:text-white transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-mono font-bold text-white w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-muted-foreground hover:text-white transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-zinc-600 hover:text-error transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* Checkout Column */}
          <div className="lg:col-span-5 glass p-6 rounded border border-border">
            <h2 className="text-lg font-bold uppercase tracking-widest text-white mb-6 border-b border-border/80 pb-4">
              Order Summary
            </h2>

            {/* Price Calculations */}
            <div className="space-y-4 mb-8 font-mono text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{cartTotal >= 3000 ? 'FREE' : '₹150'}</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between text-base font-bold text-white">
                <span>Total Due</span>
                <span>₹{cartTotal + (cartTotal >= 3000 ? 0 : 150)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button 
              onClick={handleProceedToCheckout}
              className="w-full inline-flex items-center justify-center gap-2 h-14 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors cursor-pointer mt-6"
            >
              <CreditCard className="h-4.5 w-4.5" />
              Proceed to Checkout
            </button>

            {/* Badges footer */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col gap-4 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-white shrink-0" />
                <span>SSL Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-white shrink-0" />
                <span>Stripe Payments Verified</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
