import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'De Kitchen - We Know the Magic of Flavour | Peshawar',
  description: 'De Kitchen in University Town, Peshawar. Offering Chinese, Italian, Continental, and live charcoal BBQ. Dine-in, outdoor seating, takeaway, and fast home delivery. Call 0334 4444767.',
  keywords: [
    'De Kitchen',
    'De Kitchen Peshawar',
    'Chinese restaurant Peshawar',
    'Italian pizza Peshawar',
    'Continental steak Peshawar',
    'BBQ University Town',
    'Old Jamrod Road restaurant',
    'online food delivery Peshawar',
  ],
  openGraph: {
    title: 'De Kitchen - We Know the Magic of Flavour',
    description: 'Chinese, Italian, Continental & Live BBQ in University Town, Peshawar. Order online with live tracking!',
    images: ['https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-950 text-white flex flex-col antialiased selection:bg-primary selection:text-dark-950">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <WhatsAppButton />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
