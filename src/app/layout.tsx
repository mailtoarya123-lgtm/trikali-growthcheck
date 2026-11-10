import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Trikali GrowthCheck — AI Marketing Audit Platform',
  description: 'Discover practical ways to improve your website, SEO, content, and customer acquisition with an AI-powered marketing audit by Trikali.',
  metadataBase: new URL('https://trikali.com'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Trikali GrowthCheck — AI Marketing Audit Platform',
    description: 'Instant, real-world technical and AI marketing audits for high-growth businesses.',
    url: 'https://trikali.com',
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
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fbfcfd] text-[#09122c] selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
