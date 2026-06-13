'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/database.types';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart, Plus, Minus, ChevronDown, Check, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  // Variant & State selectors
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors.length > 0 ? product.colors[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  const favorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, selectedSize, selectedColor);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleWishlistToggle = async () => {
    await toggleWishlist(product);
  };

  const incrementQty = () => setQuantity(q => q + 1);
  const decrementQty = () => setQuantity(q => Math.max(1, q - 1));

  const toggleAccordion = (name: string) => {
    setOpenAccordion(prev => (prev === name ? null : name));
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8 sm:mb-12">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all garments
          </Link>
        </div>

        {/* Product Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-start">
          
          {/* Images Columns */}
          <div className="flex flex-col gap-4">
            {/* Primary Main Image Frame */}
            <div className="relative aspect-[4/5] bg-zinc-950 rounded overflow-hidden border border-border">
              <Image 
                src={product.images[activeImageIdx] || '/logo.png'}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {product.inventory <= 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="border border-white/60 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded bg-black/40">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails List */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 aspect-[4/5] rounded overflow-hidden bg-zinc-950 border transition-all ${idx === activeImageIdx ? 'border-white' : 'border-border hover:border-white/50'}`}
                  >
                  <Image 
                      src={img}
                      alt={`${product.name} - view ${idx + 1} of ${product.images.length}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col">
            
            {/* Title & Brand */}
            <div className="border-b border-border pb-6 mb-6">
              <span className="text-xs font-mono text-accent uppercase tracking-widest block mb-2">ZELIX Collection</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mb-3 leading-tight">
                {product.name}
              </h1>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                ₹{product.price}
              </span>
            </div>

            {/* Colors Variant Selector */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-xs font-mono uppercase text-muted-foreground mb-3">
                  <span>Select Color</span>
                  <span className="text-white">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded text-xs uppercase tracking-wider font-semibold transition-all ${color === selectedColor ? 'bg-white text-black border-white' : 'bg-transparent border-border text-white hover:border-white/50'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Variant Selector */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between text-xs font-mono uppercase text-muted-foreground mb-3">
                  <span>Select Size</span>
                  <span className="text-white">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded text-xs uppercase tracking-wider font-semibold transition-all ${size === selectedSize ? 'bg-white text-black border-white' : 'bg-transparent border-border text-white hover:border-white/50'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              
              {/* Qty Counter */}
              <div className="flex items-center justify-between border border-border rounded bg-card/40 px-3 py-3 w-full sm:w-36 h-14">
                <button 
                  onClick={decrementQty}
                  className="p-1.5 text-muted-foreground hover:text-white transition-colors"
                  aria-label="Decrease Quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-mono font-bold text-white w-8 text-center">{quantity}</span>
                <button 
                  onClick={incrementQty}
                  className="p-1.5 text-muted-foreground hover:text-white transition-colors"
                  aria-label="Increase Quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={product.inventory <= 0}
                className="flex-grow inline-flex items-center justify-center gap-2 h-14 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer"
              >
                {product.inventory <= 0 ? (
                  'Sold Out'
                ) : isAdding ? (
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4.5 w-4.5" />
                    Added to Bag
                  </span>
                ) : (
                  <>
                    <ShoppingCart className="h-4.5 w-4.5" />
                    Add to Bag
                  </>
                )}
              </button>

              {/* Favorite Wishlist Trigger */}
              <button
                onClick={handleWishlistToggle}
                className={`h-14 w-14 border rounded flex items-center justify-center transition-all cursor-pointer ${favorited ? 'bg-white border-white text-black' : 'bg-transparent border-border text-white hover:border-white/50'}`}
                aria-label="Add to Wishlist"
              >
                <Heart className={`h-5 w-5 ${favorited ? 'fill-current' : ''}`} />
              </button>

            </div>

            {/* Inventory Count Warning */}
            {product.inventory > 0 && product.inventory < 10 && (
              <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-8 animate-pulse">
                Running Low: Only {product.inventory} items remaining in stock
              </p>
            )}

            {/* Editorial Product Accordions */}
            <div className="border-t border-border space-y-4 pt-6">
              
              {/* Description Accordion */}
              <div className="border-b border-border pb-4">
                <button 
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-widest text-white font-bold py-2 text-left"
                >
                  <span>Description & Details</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openAccordion === 'details' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'details' && (
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed animate-fade-in">
                    <p className="mb-4">{product.description}</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Premium French terry/nylon construction</li>
                      <li>Double-stitched seams for durability</li>
                      <li>Futuristic unisex design cuts</li>
                      <li>Ethically manufactured</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Shipping Accordion */}
              <div className="border-b border-border pb-4">
                <button 
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-widest text-white font-bold py-2 text-left"
                >
                  <span>Shipping & Returns</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="mt-3 text-sm text-muted-foreground space-y-3 animate-fade-in">
                    <div className="flex gap-2.5 items-start">
                      <Truck className="h-4.5 w-4.5 text-white shrink-0" />
                      <p className="text-xs">
                        <strong>Express Courier Shipping:</strong> Free worldwide delivery on all purchases above ₹3,000. Standard courier dispatch takes 3–5 working days.
                      </p>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <RotateCcw className="h-4.5 w-4.5 text-white shrink-0" />
                      <p className="text-xs">
                        <strong>Returns Policy:</strong> Simple returns. Send back un-worn items within 14 days of receipt for store credit or refunds.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* NFC circularity Accordion */}
              <div className="border-b border-border pb-4">
                <button 
                  onClick={() => toggleAccordion('security')}
                  className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-widest text-white font-bold py-2 text-left"
                >
                  <span>Verification & Circularity</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openAccordion === 'security' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'security' && (
                  <div className="mt-3 text-sm text-muted-foreground space-y-3 animate-fade-in">
                    <div className="flex gap-2.5 items-start">
                      <Shield className="h-4.5 w-4.5 text-white shrink-0" />
                      <p className="text-xs font-sans">
                        This item contains a passive NFC microchip sewn under the neck label. Scan with any mobile device to download the ZELIX authentic security block cert, tracking garment material sources and production timeline.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
