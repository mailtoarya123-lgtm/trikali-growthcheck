import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BarChart2, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#161616]/90 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand: Logo links to trikali.com homepage */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://trikali.com"
            className="flex items-center gap-3 group"
            title="Go to Trikali.com"
          >
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
            <span className="font-display font-extrabold text-2xl tracking-tight text-white group-hover:text-[#DDF160] transition-colors">
              Trikali
            </span>
          </a>
          <Link
            href="/"
            className="font-display text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#DDF160] hover:bg-white text-[#161616] tracking-wider uppercase transition-colors"
            title="GrowthCheck Home"
          >
            GrowthCheck
          </Link>
        </div>

        {/* Center Navigation Links (Removed Studio) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#ACACAC]">
          <Link href="/#how-it-works" className="hover:text-[#DDF160] transition-colors">
            How It Works
          </Link>
          <Link href="/#what-we-check" className="hover:text-[#DDF160] transition-colors">
            Audit Scope
          </Link>
          <Link href="/audit/demo-audit-sample" className="flex items-center gap-1.5 text-[#DDF160] hover:text-white transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            Live Demo
          </Link>
          <Link href="/admin" className="flex items-center gap-1.5 text-[#838383] hover:text-white transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="https://trikali.com/contact-page.php"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/20 text-xs font-semibold text-white transition-colors hover:bg-[#DDF160] hover:text-[#161616] hover:border-[#DDF160]"
          >
            Say Hello <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <Link
            href="/#audit-form"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DDF160] hover:bg-white text-[#161616] text-xs font-bold transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Free Audit
          </Link>
        </div>
      </div>
    </header>
  );
}
