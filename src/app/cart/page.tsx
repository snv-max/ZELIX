'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';
import { Trash2, ShoppingBag, Plus, Minus, CreditCard, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { mockDb } from '@/lib/mockData';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart } = useCart();
  const { user, isLoaded } = useUser();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!user) {
      alert('Please log in or register to complete your purchase.');
      router.push('/login?redirect=/cart');
      return;
    }

    if (cart.length === 0) return;

    setIsCheckingOut(true);

    try {
      // Check if Stripe is configured by testing env or requesting endpoint
      const stripeSecretAvailable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      
      if (!stripeSecretAvailable) {
        // Stripe credentials not set: process as a Mock Order
        console.log('Stripe Publishable Key not set. Processing as simulated mock checkout.');
        
        // Create Mock Order
        const orderItems = cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          color: item.color,
        }));

        const mockOrder = mockDb.createOrder(
          {
            user_id: user.id,
            total_amount: cartTotal,
            status: 'processing', // Mark processing immediately for mock
            shipping_address: shippingAddress,
            stripe_session_id: 'mock_sess_' + Math.random().toString(36).substr(2, 9),
          },
          orderItems
        );

        // Trigger order confirmation email via API endpoint (async)
        const orderForEmail = {
          ...mockOrder,
          items: cart.map(item => ({
            id: 'mock_item_' + Math.random().toString(36).substr(2, 9),
            order_id: mockOrder.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
            color: item.color,
            product: item.product
          }))
        };
        fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: orderForEmail,
            customerEmail: shippingAddress.email || user.primaryEmailAddress?.emailAddress || '',
          }),
        }).catch(err => console.error('Failed to trigger confirmation email:', err));

        // Clear local cart
        clearCart();
        
        // Redirect to success
        router.push(`/checkout/success?session_id=${mockOrder.stripe_session_id}&mock=true`);
        return;
      }

      // Real Stripe Checkout Integration
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          shippingAddress,
          userId: user.id,
        }),
      });

      const session = await response.json();
      if (session.error) {
        throw new Error(session.error);
      }

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
      if (stripe) {
        const { error } = await (stripe as any).redirectToCheckout({
          sessionId: session.id,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Payment system error. Please try again.');
    } finally {
      setIsCheckingOut(false);
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

          {/* Checkout and Form Column */}
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

            {/* Address Checkout Form */}
            <form onSubmit={handleCheckout} className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 block">
                Shipping Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={shippingAddress.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={shippingAddress.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Address Line 1</label>
                <input 
                  type="text" 
                  name="line1" 
                  required 
                  value={shippingAddress.line1}
                  onChange={handleInputChange}
                  placeholder="123 Street Name"
                  className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Address Line 2 (Optional)</label>
                <input 
                  type="text" 
                  name="line2" 
                  value={shippingAddress.line2}
                  onChange={handleInputChange}
                  placeholder="Apt, Suite, Floor"
                  className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    required 
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="Los Angeles"
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">State / Region</label>
                  <input 
                    type="text" 
                    name="state" 
                    required 
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="CA"
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Postal Code</label>
                  <input 
                    type="text" 
                    name="postal_code" 
                    required 
                    value={shippingAddress.postal_code}
                    onChange={handleInputChange}
                    placeholder="90001"
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-border/50 rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Country</label>
                  <select 
                    name="country" 
                    required 
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="w-full bg-[#18181b]/50 border border-border text-sm text-white rounded px-3 py-2.5 focus:outline-none focus:border-white transition-colors"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>
              </div>

              {/* Checkout Buttons */}
              <button 
                type="submit"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    alert('Please log in or register to complete your purchase.');
                    router.push('/login?redirect=/cart');
                  }
                }}
                disabled={isCheckingOut}
                className="w-full inline-flex items-center justify-center gap-2 h-14 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors cursor-pointer mt-6 disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {isCheckingOut ? (
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                ) : (
                  <>
                    <CreditCard className="h-4.5 w-4.5" />
                    Proceed to Payment
                  </>
                )}
              </button>
            </form>

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
