import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'ZELIX | High-End Unisex Streetwear & Activewear',
    template: '%s | ZELIX'
  },
  description: 'Shop premium, genderless activewear, heavyweight hoodies, utility cargo pants, shield visor sunglasses, and cyber-aesthetic sneakers at ZELIX.',
  keywords: ['streetwear', 'unisex', 'fashion', 'hoodies', 'cargos', 'sneakers', 'activewear'],
  authors: [{ name: 'ZELIX' }],
  metadataBase: new URL('http://localhost:3000'), // Fallback URL
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className="antialiased min-h-full flex flex-col font-sans"
      >
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow pt-16 sm:pt-20">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
