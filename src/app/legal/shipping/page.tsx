import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | ZELIX',
  description: 'ZELIX ships across India with 3–7 day delivery. Free shipping on orders above ₹3,000. Learn about our shipping partners, timelines, and international delivery.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <span className="text-xs font-mono text-accent uppercase tracking-widest block mb-3">Legal</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">Shipping Policy</h1>
          <p className="text-sm text-muted-foreground font-mono">Last updated: June 2025</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-muted-foreground">

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">1. Shipping Coverage</h2>
            <p>ZELIX currently ships to all states and union territories within <strong className="text-white">India</strong>. International shipping is available to select countries — contact us for a quote.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">2. Shipping Charges</h2>
            <div className="bg-zinc-900 border border-border rounded p-5 font-mono text-sm space-y-3">
              <div className="flex justify-between">
                <span>Orders above ₹3,000</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span>Orders below ₹3,000</span>
                <span className="text-white font-bold">₹150 flat</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">3. Processing Time</h2>
            <p>Orders are processed within <strong className="text-white">1–2 business days</strong> (Monday–Saturday, excluding public holidays). You will receive an order confirmation email immediately after checkout.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">4. Delivery Timelines</h2>
            <div className="bg-zinc-900 border border-border rounded p-5 font-mono text-sm space-y-3">
              <div className="flex justify-between">
                <span>Metro cities (Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Kolkata)</span>
                <span className="text-white font-bold">3–5 days</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span>Tier 2 & 3 cities</span>
                <span className="text-white font-bold">5–7 days</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span>Remote & northeast regions</span>
                <span className="text-white font-bold">7–10 days</span>
              </div>
            </div>
            <p className="mt-3 text-xs">Timelines are estimates and may be affected by public holidays, natural events, or courier delays outside our control.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">5. Shipment Tracking</h2>
            <p>Once your order is dispatched, you will receive a shipping confirmation with a tracking number via email. You can track your package directly through the courier&apos;s website. Tracking information may take 24 hours to become active.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">6. Failed Deliveries</h2>
            <p>If a delivery attempt fails due to an incorrect address or unavailability of the recipient, the courier will reattempt delivery. After 2 failed attempts, the parcel may be returned to us. Re-shipping charges will apply. Please ensure your shipping address and phone number are accurate at the time of checkout.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">7. Damaged in Transit</h2>
            <p>If your order arrives damaged, please take photos immediately and contact us within <strong className="text-white">48 hours</strong> at <a href="mailto:support@zelix.shop" className="text-accent hover:underline">support@zelix.shop</a>. We will arrange a replacement or full refund.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">8. International Shipping</h2>
            <p>International orders are subject to customs duties, import taxes, and fees levied by the destination country. ZELIX is not responsible for these additional charges. Please check your country&apos;s import regulations before ordering.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">9. Contact</h2>
            <p>For shipping enquiries, contact us at <a href="mailto:support@zelix.shop" className="text-accent hover:underline">support@zelix.shop</a> or WhatsApp <a href="https://wa.me/919895308806" className="text-accent hover:underline">+91 98953 08806</a>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
