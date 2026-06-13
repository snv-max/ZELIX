import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zelix.shop';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ZELIX | High-End Unisex Streetwear & Activewear',
    template: '%s | ZELIX',
  },
  description:
    'Shop premium, genderless activewear, heavyweight hoodies, utility cargo pants, shield visor sunglasses, and cyber-aesthetic sneakers at ZELIX. Free shipping above ₹3,000.',
  keywords: [
    'streetwear',
    'unisex fashion',
    'hoodies India',
    'cargo pants',
    'sneakers',
    'activewear',
    'ZELIX',
    'streetwear India',
    'premium clothing',
  ],
  authors: [{ name: 'ZELIX' }],
  creator: 'ZELIX',
  publisher: 'ZELIX',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'ZELIX',
    title: 'ZELIX | High-End Unisex Streetwear & Activewear',
    description:
      'Shop premium, genderless activewear, heavyweight hoodies, utility cargo pants, and cyber-aesthetic sneakers at ZELIX. Free shipping above ₹3,000.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZELIX — Premium Unisex Streetwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZELIX | High-End Unisex Streetwear',
    description: 'Shop premium, genderless streetwear at ZELIX. Free shipping above ₹3,000.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className="antialiased min-h-full flex flex-col font-sans">
        <AuthProvider>
          <CartProvider>
            <Suspense
              fallback={<div className="h-16 sm:h-20 bg-background/50 border-b border-border" />}
            >
              <Header />
            </Suspense>
            <main className="flex-grow pt-16 sm:pt-20">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
