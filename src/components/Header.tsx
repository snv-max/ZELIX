'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Heart, User as UserIcon, Search, X, Menu, Settings, LogOut } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartCount, wishlist } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const activeLinkClass = (path: string) => {
    const [pathPart, queryPart] = path.split('?');
    let isActive = false;
    
    if (queryPart) {
      const [key, val] = queryPart.split('=');
      isActive = pathname === pathPart && searchParams.get(key) === val;
    } else {
      isActive = pathname === pathPart && !searchParams.get('category');
    }

    return isActive 
      ? 'text-red-500 font-semibold border-b-2 border-red-500 pb-1' 
      : 'text-muted-foreground hover:text-red-500 transition-colors pb-1';
  };

  const mobileLinkClass = (path: string) => {
    const [pathPart, queryPart] = path.split('?');
    let isActive = false;
    
    if (queryPart) {
      const [key, val] = queryPart.split('=');
      isActive = pathname === pathPart && searchParams.get(key) === val;
    } else {
      isActive = pathname === pathPart && !searchParams.get('category');
    }

    return isActive
      ? 'text-red-500 font-bold'
      : 'text-muted-foreground hover:text-red-500 transition-colors';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-muted-foreground hover:text-white transition-colors"
            id="mobile-menu-trigger"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-md bg-white p-0.5 flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="ZELIX Logo" 
                fill 
                className="object-contain" 
                sizes="(max-width: 768px) 32px, 40px"
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-widest text-white font-sans">
              ZELIX
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest">
            <Link href="/" className={activeLinkClass('/')}>Home</Link>
            <Link href="/products" className={activeLinkClass('/products')}>Shop</Link>
            <Link href="/products?category=tshirt" className={activeLinkClass('/products?category=tshirt')}>T-Shirts</Link>
            <Link href="/products?category=track" className={activeLinkClass('/products?category=track')}>Tracks</Link>
            <Link href="/products?category=pants" className={activeLinkClass('/products?category=pants')}>Pants</Link>
            <Link href="/cart" className={activeLinkClass('/cart')}>Cart ({mounted ? cartCount : 0})</Link>
            {mounted && user ? (
              <Link href="/account" className={activeLinkClass('/account')}>Account</Link>
            ) : (
              <Link href="/login" className={activeLinkClass('/login')}>Login</Link>
            )}
          </nav>

          {/* Header Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3 md:gap-4">
            
            {/* Search Icon */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:p-2 text-muted-foreground hover:text-white transition-colors relative"
              aria-label="Search Catalog"
              id="search-btn"
            >
              <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Wishlist Icon */}
            <Link 
              href="/wishlist" 
              className="p-1.5 sm:p-2 text-muted-foreground hover:text-white transition-colors relative"
              aria-label="View Wishlist"
              id="wishlist-btn"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              {mounted && wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-glow">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link 
              href="/cart" 
              className="p-1.5 sm:p-2 text-muted-foreground hover:text-white transition-colors relative"
              aria-label="View Shopping Cart"
              id="cart-btn"
            >
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown Container */}
            <div className="relative">
              {mounted && user ? (
                <>
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="p-1.5 sm:p-2 flex items-center gap-1.5 text-muted-foreground hover:text-white transition-colors rounded-full border border-transparent hover:border-border"
                    id="profile-dropdown-trigger"
                  >
                    <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="hidden lg:inline text-xs max-w-[80px] truncate text-left">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg glass border border-border z-50 py-1 origin-top-right animate-fade-in">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-xs text-muted-foreground font-mono">Signed in as</p>
                          <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-widest text-black bg-white px-1.5 py-0.5 rounded">
                              Admin Role
                            </span>
                          )}
                        </div>

                        <Link 
                          href="/account" 
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <UserIcon className="h-4 w-4" />
                          My Account
                        </Link>

                        {isAdmin && (
                          <Link 
                            href="/admin" 
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors border-t border-border/50"
                          >
                            <Settings className="h-4 w-4 text-accent" />
                            Admin Dashboard
                          </Link>
                        )}

                        <button 
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            signOut();
                            router.push('/');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors text-left border-t border-border/50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="p-1.5 sm:p-2 flex items-center gap-1.5 text-muted-foreground hover:text-white transition-colors"
                  id="login-btn"
                >
                  <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden lg:inline text-xs uppercase tracking-widest font-semibold">Login</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 bottom-0 left-0 w-80 max-w-full z-50 glass border-r border-border p-6 flex flex-col justify-between animate-fade-in" style={{ animationDuration: '0.2s' }}>
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold tracking-widest text-white">ZELIX</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-6 text-lg uppercase tracking-wider">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/')}
                >
                  Home
                </Link>
                <Link 
                  href="/products" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/products')}
                >
                  Shop
                </Link>
                <Link 
                  href="/products?category=tshirt" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/products?category=tshirt')}
                >
                  T-Shirts
                </Link>
                <Link 
                  href="/products?category=track" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/products?category=track')}
                >
                  Tracks & Hoodies
                </Link>
                <Link 
                  href="/products?category=pants" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/products?category=pants')}
                >
                  Pants
                </Link>
                <Link 
                  href="/cart" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/cart')}
                >
                  Cart ({mounted ? cartCount : 0})
                </Link>
                {mounted && user ? (
                  <Link 
                    href="/account" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={mobileLinkClass('/account')}
                  >
                    Account
                  </Link>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={mobileLinkClass('/login')}
                  >
                    Login
                  </Link>
                )}
              </nav>
            </div>

            <div className="border-t border-border pt-6">
              {mounted && user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <div className="truncate">
                      <p className="text-sm font-semibold text-white truncate">{profile?.full_name || user.email}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">{profile?.role}</p>
                    </div>
                  </div>
                  <Link 
                    href="/account" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm text-muted-foreground hover:text-white py-1.5 transition-colors"
                  >
                    My Account
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm text-accent hover:text-white py-1.5 transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut();
                      router.push('/');
                    }}
                    className="text-sm text-error hover:text-red-400 py-1.5 text-left transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-white text-black font-semibold rounded text-sm uppercase tracking-widest"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      {/* Overlay Full-screen Search Bar */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col justify-start pt-32 px-4 sm:px-6 animate-fade-in" style={{ animationDuration: '0.2s' }}>
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Search ZELIX Catalog</span>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-muted-foreground hover:text-white transition-colors"
                id="search-close-btn"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                type="text" 
                placeholder="Type hoodies, pants, tracks, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-2xl sm:text-4xl text-white placeholder-border/80 focus:ring-0 focus:outline-none py-2"
                autoFocus
              />
              <button 
                type="submit" 
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white hover:scale-105 transition-transform"
              >
                <Search className="h-8 w-8" />
              </button>
            </form>
            
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Trending searches</p>
              <div className="flex flex-wrap gap-2">
                {['Hoodie', 'Cargo', 'Shield', 'Sneakers', 'Unisex'].map((term) => (
                  <button 
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      router.push(`/products?search=${term}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="px-4 py-1.5 rounded-full border border-border text-xs uppercase tracking-wider text-muted-foreground hover:text-white hover:border-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
