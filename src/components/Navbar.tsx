import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BarChart2, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#161616]/85 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Image
              src="/icon-trikali.png"
              alt="Trikali"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl tracking-tight text-white">
              Trikali
            </span>
            <span className="font-display text-xs font-semibold px-2 py-0.5 rounded-full bg-[#DDF160] text-[#161616] tracking-wider uppercase">
              GrowthCheck
            </span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#ACACAC]">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#what-we-check" className="hover:text-white transition-colors">Audit Scope</a>
          <a href="https://trikali.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
            Studio <ArrowUpRight className="w-3.5 h-3.5 text-[#737373]" />
          </a>
          <Link href="/audit/demo-audit-sample" className="flex items-center gap-1.5 hover:text-white transition-colors text-[#DDF160]">
            <Sparkles className="w-3.5 h-3.5" />
            Live Demo
          </Link>
          <Link href="/admin" className="flex items-center gap-1.5 hover:text-white transition-colors text-[#838383]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>

        {/* Controls matching trikali.com rounded buttons */}
        <div className="flex items-center gap-3">
          <a
            href="https://trikali.com/contact-page.php"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-xs font-semibold text-white transition-all hover:bg-white hover:text-black"
          >
            Say Hello <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="#audit-form"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DDF160] hover:bg-[#c7db4a] text-[#161616] text-xs font-bold transition-all shadow-lg shadow-[#DDF160]/10 hover:shadow-[#DDF160]/25"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Free Audit
          </a>
        </div>
      </div>
    </header>
  );
}
