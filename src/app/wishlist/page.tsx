'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background text-foreground grid-bg px-4">
        <div className="max-w-md w-full text-center border border-border bg-card p-10 rounded">
          <Heart className="h-12 w-12 text-zinc-700 mx-auto mb-6" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Wishlist is Empty</h2>
          <p className="text-sm text-muted-foreground mb-8">
            You haven't saved any items yet. Explore the shop and click the heart icon on any product to save it here.
          </p>
          <Link 
            href="/products" 
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded py-4 hover:bg-zinc-200 transition-colors"
          >
            Explore Garments
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
          MY WISHLIST
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
}
