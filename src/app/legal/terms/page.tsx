import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ZELIX',
  description: 'Read the terms and conditions governing your use of the ZELIX platform and purchase of ZELIX products.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <span className="text-xs font-mono text-accent uppercase tracking-widest block mb-3">Legal</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">Terms of Service</h1>
          <p className="text-sm text-muted-foreground font-mono">Last updated: June 2025</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-muted-foreground">

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the ZELIX website (<a href="https://www.zelix.shop" className="text-accent hover:underline">www.zelix.shop</a>) or placing an order, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our platform.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">2. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must be at least 18 years of age to create an account and make purchases.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide accurate and complete information during registration and checkout.</li>
              <li>ZELIX reserves the right to terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">3. Products & Pricing</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>All prices on ZELIX are listed in Indian Rupees (₹) and include applicable taxes unless stated otherwise.</li>
              <li>We reserve the right to modify prices, discontinue products, or limit quantities at any time.</li>
              <li>Product images are for illustration purposes. Actual colours may vary slightly due to screen calibration.</li>
              <li>ZELIX does not guarantee that any product will always be available in stock.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">4. Orders & Payment</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Placing an order constitutes an offer to purchase. ZELIX reserves the right to accept or cancel any order.</li>
              <li>Payment is processed securely via Stripe. We accept major credit/debit cards and other Stripe-supported methods.</li>
              <li>You will receive an order confirmation email upon successful payment. This does not constitute acceptance of the order until it has been dispatched.</li>
              <li>In the event of a pricing error, we reserve the right to cancel the order and issue a full refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">5. Intellectual Property</h2>
            <p>All content on ZELIX — including logos, images, copy, design, and product names — is the exclusive property of ZELIX or its licensors. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">6. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Use the platform for any unlawful or fraudulent purpose</li>
              <li>Attempt to gain unauthorised access to any part of the platform or its systems</li>
              <li>Submit false or misleading information</li>
              <li>Interfere with the operation of the platform via bots, scrapers, or other automated means</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, ZELIX shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or purchased products. Our total liability to you shall not exceed the amount paid for the relevant order.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">8. Governing Law</h2>
            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Kerala, India.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">9. Changes to Terms</h2>
            <p>ZELIX reserves the right to update these Terms at any time. Continued use of the platform after any changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-white mb-3">10. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:support@zelix.shop" className="text-accent hover:underline">support@zelix.shop</a>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
