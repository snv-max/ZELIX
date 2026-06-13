'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#030305] border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-8">

          {/* Logo and Brand */}
          <div className="md:col-span-1 flex flex-col justify-start">
            <span className="text-2xl font-black tracking-widest text-white mb-6">ZELIX</span>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
              Premium, genderless, high-end streetwear and activewear. Form follows utility. Designed for the futuristic aesthetic.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'TikTok'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  aria-label={`Follow ZELIX on ${platform}`}
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest font-bold text-white mb-6">Shop Collections</span>
            <ul className="space-y-3.5 text-sm">
              <li><Link href="/products" className="text-muted-foreground hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=tshirt" className="text-muted-foreground hover:text-white transition-colors">T-Shirts</Link></li>
              <li><Link href="/products?category=track" className="text-muted-foreground hover:text-white transition-colors">Track &amp; Outerwear</Link></li>
              <li><Link href="/products?category=pants" className="text-muted-foreground hover:text-white transition-colors">Pants</Link></li>
              <li><Link href="/products?category=accessories" className="text-muted-foreground hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest font-bold text-white mb-6">Information</span>
            <ul className="space-y-3.5 text-sm">
              <li><Link href="/contact" className="text-muted-foreground hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/legal/shipping" className="text-muted-foreground hover:text-white transition-colors">Shipping &amp; Delivery</Link></li>
              <li><Link href="/legal/refund" className="text-muted-foreground hover:text-white transition-colors">Returns &amp; Refunds</Link></li>
              <li><Link href="/legal/terms" className="text-muted-foreground hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="text-muted-foreground hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest font-bold text-white mb-6">Sign Up For Updates</span>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Subscribe to receive updates on collections, exclusive drops, and stock notifications.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                required
                aria-label="Email address for newsletter"
                className="w-full bg-border/20 border border-border/80 text-sm text-white placeholder-muted-foreground rounded px-4 py-3 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center bg-white text-black text-xs uppercase tracking-widest font-bold rounded py-3 hover:bg-white/95 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p>© {new Date().getFullYear()} ZELIX. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/legal/refund" className="hover:text-white transition-colors">Refunds</Link>
            <Link href="/legal/shipping" className="hover:text-white transition-colors">Shipping</Link>
            <span>Stripe Payments Secured</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
