import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCategories, fetchProducts } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const categories = await fetchCategories();
  const products = await fetchProducts();
  
  // Showcase the first 4 products as featured collections
  const featuredProducts = products.slice(0, 4);

  // Category image mapping (using our premium visuals or clean styled placeholders)
  const categoryImages: Record<string, string> = {
    'tshirt': '/products/hoodie.png',
    'track': '/products/hoodie.png',
    'pants': '/products/cargo.png',
    'accessories': '/products/sunglasses.png',
    'shoes': '/products/sneakers.png',
  };

  return (
    <div className="flex flex-col min-h-screen grid-bg">
      
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden border-b border-border">
        {/* Subtle grid and overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-background z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
        
        {/* Background Image: Streetwear theme overlay */}
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <Image 
            src="/products/cargo.png" // Using the premium cargo image
            alt="Hero Background"
            fill
            priority
            className="object-cover object-center scale-105 blur-sm"
          />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20 flex flex-col items-center">
          <span className="inline-block border border-accent/40 text-accent text-[10px] font-mono font-bold uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full mb-6 bg-accent/5 animate-pulse-glow">
            Summer Drop // Volume 01
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-white uppercase select-none mb-6">
            ZELIX<span className="text-zinc-600 font-light font-mono">{"//"}</span>WEAR
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground uppercase tracking-widest max-w-xl mb-10 leading-relaxed font-light">
            Sleek technical activewear and streetwear silhouetted for the post-modern aesthetic. Genderless & heavy duty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded"
            >
              Shop Collections
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/products?category=track" 
              className="inline-flex items-center justify-center px-8 py-4 glass text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all rounded"
            >
              View Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Marquee Banner */}
      <section className="bg-white text-black py-4 overflow-hidden select-none border-y border-border">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array(4).fill([
            'UNISEX COLLECTION', 'HEAVYWEIGHT FRENCH TERRY HOODIES', 'TECHNICAL CARGO TROUSERS', 
            'UV400 SHIELD SUNGLASSES', 'CYBER HIGH-TOP RUNNERS', 'FORM FOLLOWS UTILITY'
          ]).flat().map((text, idx) => (
            <span key={idx} className="text-xs font-mono font-black uppercase tracking-[0.2em] mx-12 flex items-center">
              {text} <span className="text-zinc-400 ml-4 font-light">{"//"}</span>
            </span>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs font-mono text-accent uppercase tracking-widest block mb-2">Selected Garments</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">Featured Drops</h2>
          </div>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors mt-4 md:mt-0"
          >
            Explore all items
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Interactive Categories */}
      <section className="bg-card border-y border-border py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-accent uppercase tracking-widest block mb-2">Tailored Silhouettes</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">Browse By Category</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.slug}`}
                className="group relative h-80 rounded overflow-hidden border border-border/80 flex flex-col justify-end p-6 hover:border-white/30 transition-all duration-300"
              >
                {/* Visual backdrop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
                <div className="absolute inset-0 bg-zinc-950 scale-100 group-hover:scale-105 transition-transform duration-700 ease-out">
                  {categoryImages[category.slug] ? (
                    <Image 
                      src={categoryImages[category.slug]}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover opacity-35 mix-blend-luminosity group-hover:opacity-50 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#18181b] flex items-center justify-center">
                      <Zap className="h-8 w-8 text-zinc-800" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="relative z-20">
                  <h3 className="text-base font-bold uppercase tracking-wider text-white mb-1 group-hover:text-accent transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Brand Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start p-6 rounded bg-[#0d0d11]/40 border border-border/60">
            <div className="h-12 w-12 rounded bg-white/5 border border-border/80 flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white mb-2">Express Shipping</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Global express dispatch with end-to-end customs handling and secure courier transport. Free on orders above ₹3,000.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start p-6 rounded bg-[#0d0d11]/40 border border-border/60">
            <div className="h-12 w-12 rounded bg-white/5 border border-border/80 flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white mb-2">Authentic Security</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each garment carries an integrated NFC chip. Verify product authenticity and production details instantly.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start p-6 rounded bg-[#0d0d11]/40 border border-border/60">
            <div className="h-12 w-12 rounded bg-white/5 border border-border/80 flex items-center justify-center mb-6">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white mb-2">Lifetime Circularity</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Send back pre-worn ZELIX items for recycling or resale in exchange for store credit. Minimizing waste, maximizing lifecycle.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
