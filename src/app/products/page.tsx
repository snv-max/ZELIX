'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchCategories, fetchProducts } from '@/lib/data';
import { Product, Category } from '@/types/database.types';
import ProductCard from '@/components/ProductCard';
import { Grid, SlidersHorizontal, Search, RotateCcw, ArrowUpDown } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter and Sort states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Load Categories & Products on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load products page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync with URL params
  useEffect(() => {
    const catParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('all');
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  // Filter products locally
  const filteredProducts = products
    .filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && product.category_id !== cat.id) return false;
      }
      
      // 2. Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // 3. Sorting logic
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0; // 'featured' (default)
    });

  // Handler for category filter change
  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/products?${params.toString()}`);
  };

  // Handler for search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim() === '') {
      params.delete('search');
    } else {
      params.set('search', searchQuery.trim());
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
    router.push('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Loading catalog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="border-b border-border pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-2">
              GARMENTS
            </h1>
            <p className="text-sm text-muted-foreground uppercase tracking-widest">
              Showing {filteredProducts.length} of {products.length} technical items
            </p>
          </div>

          {/* Quick Filters toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`md:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded border text-xs uppercase tracking-widest font-semibold transition-colors ${isFilterPanelOpen ? 'bg-white text-black border-white' : 'bg-transparent border-border text-white hover:border-white/40'}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <div className="relative inline-flex items-center gap-2 bg-card border border-border rounded px-3 py-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs uppercase tracking-widest font-semibold text-white focus:outline-none focus:ring-0 pr-6 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Drops</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* Desktop Left Filter Panel */}
          <aside className={`lg:block ${isFilterPanelOpen ? 'block' : 'hidden'} space-y-8 glass p-6 rounded border border-border`}>
            
            {/* Category selection */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Categories</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleCategoryChange('all')}
                  className={`text-left text-sm py-2 px-3 rounded uppercase tracking-wider transition-colors ${selectedCategory === 'all' ? 'bg-white/10 text-white font-bold' : 'text-muted-foreground hover:text-white'}`}
                >
                  All Collections
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`text-left text-sm py-2 px-3 rounded uppercase tracking-wider transition-colors ${selectedCategory === cat.slug ? 'bg-white/10 text-white font-bold' : 'text-muted-foreground hover:text-white'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Search Form */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Search</h3>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input 
                  type="text" 
                  placeholder="Keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#18181b]/50 border border-border text-sm text-white placeholder-muted-foreground rounded px-4 py-2.5 focus:outline-none focus:border-white transition-colors"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Clear filters CTA */}
            {(selectedCategory !== 'all' || searchQuery !== '' || sortBy !== 'featured') && (
              <button 
                onClick={handleClearFilters}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-red-950/40 bg-red-950/10 text-red-400 hover:bg-red-950/20 text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear Filters
              </button>
            )}

          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="border border-dashed border-border rounded-lg p-20 text-center flex flex-col items-center justify-center">
                <Grid className="h-10 w-10 text-zinc-700 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Items Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  We couldn't find any items matching your selected filters. Try broadening your terms or clearing the selections.
                </p>
                <button 
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-bold rounded hover:bg-zinc-200 transition-colors"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Loading catalog...</span>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
