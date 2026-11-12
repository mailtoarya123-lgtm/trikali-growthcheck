'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BarChart2, ShieldCheck, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#161616]/95 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand: Logo links to trikali.com homepage */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <a
            href="https://trikali.com"
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
            title="Go to Trikali.com"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
              <Image
                src="/icon-trikali.png"
                alt="Trikali"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-white group-hover:text-[#DDF160] transition-colors">
              Trikali
            </span>
          </a>
          <Link
            href="/"
            className="font-display text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-[#DDF160] hover:bg-white text-[#161616] tracking-wider uppercase transition-colors shrink-0"
            title="GrowthCheck Home"
          >
            GrowthCheck
          </Link>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#ACACAC]">
          <Link href="/#how-it-works" className="hover:text-[#DDF160] transition-colors">
            How It Works
          </Link>
          <Link href="/#what-we-check" className="hover:text-[#DDF160] transition-colors">
            Audit Scope
          </Link>
          <Link href="/admin" className="flex items-center gap-1.5 text-[#838383] hover:text-white transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>

        {/* Right Action Buttons (Desktop & Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#DDF160] hover:bg-white text-[#161616] text-xs font-bold transition-colors whitespace-nowrap"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Free Audit</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white hover:bg-[#DDF160] hover:text-[#161616] hover:border-[#DDF160] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#161616] px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-1 text-sm font-medium text-[#ACACAC]">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-[#DDF160] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#what-we-check"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-[#DDF160] transition-colors"
            >
              Audit Scope
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-white flex items-center gap-2 text-[#838383] transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          </nav>
          <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2.5">
            <a
              href="https://trikali.com/contact-page.php"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-white/20 text-xs font-semibold text-white transition-colors hover:bg-[#DDF160] hover:text-[#161616] hover:border-[#DDF160]"
            >
              Say Hello <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
