import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ZELIX',
  description: 'Learn how ZELIX collects, uses, and protects your personal data when you shop with us.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <span className="text-xs font-mono text-accent uppercase tracking-widest block mb-3">Legal</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground font-mono">Last updated: June 2025</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-muted-foreground">

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">1. Information We Collect</h2>
            <p>When you visit ZELIX or place an order, we may collect the following personal information:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Name, email address, and phone number (provided during registration or checkout)</li>
              <li>Shipping address and delivery preferences</li>
              <li>Payment information (processed securely by Stripe — we never store card data)</li>
              <li>Browsing behaviour, device information, and IP address via cookies</li>
              <li>Order history and wishlist preferences stored in our secure database (Supabase)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To process and fulfil your orders</li>
              <li>To send transactional emails such as order confirmations and shipping updates</li>
              <li>To improve our product listings, website experience, and customer service</li>
              <li>To comply with legal obligations and prevent fraud</li>
              <li>To analyse site traffic and usage through Vercel Analytics (anonymised)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">3. Data Storage & Security</h2>
            <p>Your account data is stored securely in Supabase (PostgreSQL) with row-level security policies. Payment data is handled entirely by Stripe and is never stored on our servers. All connections are encrypted via HTTPS/TLS.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">4. Cookies</h2>
            <p>We use essential cookies for authentication (session tokens) and functional cookies for cart persistence. We do not use third-party advertising cookies. You may disable cookies in your browser, though some site features may not function correctly.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">5. Third-Party Services</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Stripe</strong> — Payment processing. Subject to <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Stripe&apos;s Privacy Policy</a>.</li>
              <li><strong className="text-white">Supabase</strong> — Database and authentication. Subject to <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Supabase&apos;s Privacy Policy</a>.</li>
              <li><strong className="text-white">Vercel</strong> — Hosting and anonymised web analytics. Subject to <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Vercel&apos;s Privacy Policy</a>.</li>
              <li><strong className="text-white">Amazon SES</strong> — Email delivery for order confirmations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at <a href="mailto:support@zelix.shop" className="text-accent hover:underline">support@zelix.shop</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">7. Data Retention</h2>
            <p>We retain order and account data for up to 3 years for legal and tax compliance purposes. You may request early deletion of your account and associated data by contacting us.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Continued use of ZELIX after any changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">9. Contact</h2>
            <p>For privacy-related enquiries, contact us at <a href="mailto:support@zelix.shop" className="text-accent hover:underline">support@zelix.shop</a> or via WhatsApp at <a href="https://wa.me/919895308806" className="text-accent hover:underline">+91 98953 08806</a>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
