import { Metadata } from 'next';
import { Mail, MessageCircle, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | ZELIX',
  description: 'Get in touch with ZELIX for order enquiries, sizing help, returns, or general questions. Email us or WhatsApp at +91 98953 08806.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 sm:py-24 grid-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14 sm:mb-20">
          <span className="text-xs font-mono text-accent uppercase tracking-widest block mb-3">Get In Touch</span>
          <h1 className="text-3xl sm:text-6xl font-extrabold uppercase tracking-tight text-white mb-4 leading-tight">
            Contact<br />ZELIX
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            We&apos;re a small, passionate team behind ZELIX. Whether you need help with an order, have a sizing question, or just want to talk streetwear — we&apos;re here.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">

          {/* Email */}
          <a
            href="mailto:support@zelix.shop"
            className="group flex flex-col gap-4 bg-zinc-900/60 border border-border hover:border-white/40 rounded p-7 transition-all duration-300 hover:bg-zinc-900"
            aria-label="Email ZELIX support"
          >
            <div className="h-12 w-12 bg-white/5 border border-border rounded flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-1">Email Support</span>
              <span className="text-base font-bold text-white group-hover:text-accent transition-colors">support@zelix.shop</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Send us a message anytime. We typically respond within 24–48 hours on business days.
            </p>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919895308806"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4 bg-zinc-900/60 border border-border hover:border-white/40 rounded p-7 transition-all duration-300 hover:bg-zinc-900"
            aria-label="WhatsApp ZELIX support"
          >
            <div className="h-12 w-12 bg-white/5 border border-border rounded flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-1">WhatsApp</span>
              <span className="text-base font-bold text-white group-hover:text-accent transition-colors">+91 98953 08806</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For faster responses, message us on WhatsApp. Available Mon–Sat, 10AM–7PM IST.
            </p>
          </a>

        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">

          <div className="flex flex-col gap-3 bg-zinc-950 border border-border rounded p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Business Hours</span>
            </div>
            <div className="text-sm text-white space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday – Saturday</span>
                <span>10:00 AM – 7:00 PM IST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 bg-zinc-950 border border-border rounded p-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Based In</span>
            </div>
            <div className="text-sm text-white font-mono">
              <p>Kerala, India</p>
              <p className="text-muted-foreground text-xs mt-1">Shipping across all of India</p>
            </div>
          </div>

        </div>

        {/* FAQ Teaser */}
        <div className="border border-border rounded p-8 bg-zinc-900/30">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Common Questions</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            {[
              {
                q: 'How do I track my order?',
                a: 'Once dispatched, you\'ll receive a tracking number via email. Delivery takes 3–7 business days within India.',
              },
              {
                q: 'Can I return or exchange an item?',
                a: 'Yes — we offer a 7-day return window on eligible items. See our Refund & Returns Policy for full details.',
              },
              {
                q: 'What sizes do you carry?',
                a: 'ZELIX carries sizes XS through XXL in most garments. Size guides are available on each product page.',
              },
              {
                q: 'Do you ship internationally?',
                a: 'Currently we primarily serve India. Contact us for international shipping enquiries.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <p className="font-bold text-white mb-1">{q}</p>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
