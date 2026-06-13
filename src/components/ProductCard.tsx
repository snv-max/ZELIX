'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/database.types';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const favorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    setIsAdding(true);
    // Add default variant: first size, first color (or OS)
    const size = product.sizes.length > 0 ? product.sizes[0] : null;
    const color = product.colors.length > 0 ? product.colors[0] : null;
    
    addToCart(product, 1, size, color);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleWishlist(product);
  };

  return (
    <div 
      className="group relative flex flex-col justify-between h-full bg-[#0d0d11] border border-border rounded overflow-hidden transition-all duration-300 hover:border-white/25"
    >
      
      {/* Product Image Panel */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] w-full overflow-hidden bg-zinc-950">
        <Image 
          src={product.images[0] || '/logo.png'} 
          alt={`${product.name} — ZELIX Streetwear`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Floating Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full glass hover:bg-white hover:text-black transition-all duration-300"
          aria-label={favorited ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart 
            className={`h-4.5 w-4.5 transition-colors ${favorited ? 'fill-white stroke-white group-hover:fill-black group-hover:stroke-black' : 'stroke-white hover:stroke-black'}`} 
          />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/85 via-black/40 to-transparent">
          <button 
            onClick={handleAddToCart}
            disabled={product.inventory <= 0}
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-semibold text-xs uppercase tracking-widest rounded py-3 hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            {product.inventory <= 0 ? (
              'Sold Out'
            ) : isAdding ? (
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                Quick Add
              </>
            )}
          </button>
        </div>

        {/* Out of Stock Label */}
        {product.inventory <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="border border-white/60 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-black/40">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="text-sm font-semibold tracking-wide text-zinc-100 group-hover:text-white transition-colors line-clamp-1">
              <Link href={`/products/${product.slug}`}>
                {product.name}
              </Link>
            </h3>
            <span className="text-sm font-bold text-white font-mono whitespace-nowrap">
              ₹{product.price}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer Variant Meta */}
        <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center justify-between text-[10px] font-mono uppercase text-muted-foreground">
          <span>{product.colors.length} Colors</span>
          <span>{product.sizes.join(', ')}</span>
        </div>
      </div>

    </div>
  );
}
