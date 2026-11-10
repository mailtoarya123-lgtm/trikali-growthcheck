import Link from 'next/link';
import { ArrowUpRight, BarChart2, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-900 via-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
              Trikali <span className="text-blue-600 font-semibold">GrowthCheck</span>
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-600">by Trikali Agency</span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
          <a href="#what-we-check" className="hover:text-blue-600 transition-colors">Audit Scope</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing & Plans</a>
          <a href="#agency" className="hover:text-blue-600 transition-colors">About Trikali</a>
          <Link href="/audit/demo-audit-sample" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            Live Demo
          </Link>
          <Link href="/admin" className="flex items-center gap-1 hover:text-blue-600 transition-colors text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Portal
          </Link>
        </nav>

        {/* Action */}
        <div className="flex items-center gap-3">
          <a
            href="https://trikali.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors px-2 py-1"
          >
            Agency Services <ArrowUpRight className="w-3 h-3" />
          </a>
          <a
            href="#audit-form"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm hover:shadow transition-all"
          >
            <BarChart2 className="w-4 h-4" />
            Free Audit
          </a>
        </div>
      </div>
    </header>
  );
}

