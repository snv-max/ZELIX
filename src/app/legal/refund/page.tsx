import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Returns Policy | ZELIX',
  description: 'ZELIX offers a 7-day return window on eligible items. Learn about our return process, conditions, and exclusions.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <span className="text-xs font-mono text-accent uppercase tracking-widest block mb-3">Legal</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">Refund & Returns Policy</h1>
          <p className="text-sm text-muted-foreground font-mono">Last updated: June 2025</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-muted-foreground">

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">1. Return Window</h2>
            <p>We accept returns within <strong className="text-white">7 days</strong> of delivery. Items must be unused, unworn, unwashed, and in their original packaging with all tags attached.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">2. Eligible Items</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Clothing (T-shirts, hoodies, pants, outerwear) — unused and with original tags</li>
              <li>Accessories — in original undamaged packaging</li>
              <li>Footwear — unworn, in original box</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">3. Non-Eligible Items</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Items marked as <strong className="text-white">Final Sale</strong> or purchased during clearance events</li>
              <li>Items that have been washed, worn, or altered in any way</li>
              <li>Items returned without original packaging or tags</li>
              <li>Gift cards</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">4. How to Initiate a Return</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Email us at <a href="mailto:support@zelix.shop" className="text-accent hover:underline">support@zelix.shop</a> or WhatsApp us at <a href="https://wa.me/919895308806" className="text-accent hover:underline">+91 98953 08806</a> with your order reference and reason for return.</li>
              <li>Our team will respond within 48 hours with return instructions and a return address.</li>
              <li>Pack the item securely and ship it using a tracked courier. Return shipping costs are borne by the customer unless the item is defective or incorrect.</li>
              <li>Once we receive and inspect the returned item, we will process your refund within 5–7 business days.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">5. Refund Method</h2>
            <p>Approved refunds are issued to the original payment method (credit/debit card via Stripe). Refunds typically appear in your account within <strong className="text-white">5–10 business days</strong> depending on your bank.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">6. Defective or Incorrect Items</h2>
            <p>If you received a defective, damaged, or incorrect item, please contact us within <strong className="text-white">48 hours</strong> of delivery with photos of the item and packaging. We will arrange a free replacement or full refund at no cost to you.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">7. Exchanges</h2>
            <p>We do not process direct exchanges at this time. To get a different size or colour, please initiate a return for the original item and place a new order for the desired variant.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">8. Contact</h2>
            <p>For all return and refund queries, contact us at <a href="mailto:support@zelix.shop" className="text-accent hover:underline">support@zelix.shop</a> or WhatsApp <a href="https://wa.me/919895308806" className="text-accent hover:underline">+91 98953 08806</a>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
