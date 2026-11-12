import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Shield, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#161616] text-[#ACACAC]">
      {/* Huge Trikali wordmark matching trikali.com footer */}
      <div className="border-b border-white/[0.06] py-8 sm:py-12 px-4 overflow-hidden text-center select-none">
        <a
          href="https://trikali.com"
          className="font-display font-extrabold text-[clamp(36px,11vw,160px)] text-white tracking-tighter leading-none inline-flex items-center justify-center gap-2 sm:gap-4 opacity-90 hover:opacity-100 transition-opacity"
        >
          <Image
            src="/icon-trikali.png"
            alt="Trikali"
            width={72}
            height={72}
            className="w-[0.7em] h-[0.7em] object-contain inline-block"
          />
          TrikaliDigital
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand Info */}
          <div className="sm:col-span-2 space-y-4">
            <a href="https://trikali.com" className="inline-flex items-center gap-2.5">
              <Image src="/icon-trikali.png" alt="Trikali" width={28} height={28} />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Trikali <span className="text-[#DDF160]">GrowthCheck</span>
              </span>
            </a>
            <p className="text-xs text-[#838383] max-w-sm leading-relaxed">
              Design-led digital growth studio based in Montreal with engineering roots in Hyderabad. Trikali GrowthCheck is an enterprise AI marketing audit engine engineered to reveal conversion leaks and commercial search opportunities.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-[#737373]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[#DDF160] font-medium border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DDF160] animate-pulse"></span>
                Engine Live
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#737373]" /> SSRF Protected
              </span>
            </div>
          </div>

          {/* Solution Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Audit Scope</h4>
            <ul className="space-y-2.5 text-xs text-[#ACACAC]">
              <li><a href="#what-we-check" className="hover:text-white transition-colors">Commercial SEO Audit</a></li>
              <li><a href="#what-we-check" className="hover:text-white transition-colors">Core Web Vitals & Speed</a></li>
              <li><a href="#what-we-check" className="hover:text-white transition-colors">Conversion (CRO) Funnels</a></li>
              <li><a href="#what-we-check" className="hover:text-white transition-colors">Heading & Metadata Hierarchy</a></li>
              <li><a href="#what-we-check" className="hover:text-white transition-colors">30-Day Growth Roadmap</a></li>
            </ul>
          </div>

          {/* Studio Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Trikali Studio</h4>
            <ul className="space-y-2.5 text-xs text-[#ACACAC]">
              <li>
                <a href="https://trikali.com" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  trikali.com <ArrowUpRight className="w-3 h-3 text-[#737373]" />
                </a>
              </li>
              <li>
                <a href="https://trikali.com/services.php" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  Services & Retainers <ArrowUpRight className="w-3 h-3 text-[#737373]" />
                </a>
              </li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Agency Lead Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] gap-4">
          <p>© 2026 Trikali Digital Growth Studio. All rights reserved.</p>
          <div className="flex gap-6 text-[#838383]">
            <a href="https://trikali.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="https://trikali.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="https://trikali.com/contact-page.php" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Say Hello</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
