import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Trikali GrowthCheck — AI Marketing & SEO Audit Platform',
  description: 'AI-powered marketing audits for ambitious brands. Discover practical ways to improve your website, SEO, content, and customer acquisition.',
  metadataBase: new URL('https://growthcheck.trikali.com'),
  icons: {
    icon: [
      { url: '/icon-trikali.png?v=2', type: 'image/png' },
    ],
    shortcut: '/icon-trikali.png?v=2',
    apple: '/icon-trikali.png?v=2',
  },
  openGraph: {
    title: 'Trikali GrowthCheck — AI Marketing Audit Platform',
    description: 'Instant, real-world technical and AI marketing audits by Trikali Digital Studio.',
    url: 'https://growthcheck.trikali.com',
    siteName: 'Trikali GrowthCheck',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#161616] text-[#FAF7F6] selection:bg-[#DDF160] selection:text-[#161616]">
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
