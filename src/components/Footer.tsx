'use client';

import Link from 'next/link';
import { Sparkles, Shield, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-blue-300" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                Trikali <span className="text-blue-600">GrowthCheck</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Trikali GrowthCheck is an enterprise-grade AI marketing audit engine engineered by <strong className="text-slate-700">Trikali</strong> to reveal conversion leaks, SEO blindspots, and high-impact revenue opportunities for modern businesses.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Engine Operational
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-slate-600" /> Enterprise SSRF Protected
              </span>
            </div>
          </div>

          {/* Solution Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">Platform Scope</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><a href="#what-we-check" className="hover:text-blue-600 transition-colors">Technical SEO Audit</a></li>
              <li><a href="#what-we-check" className="hover:text-blue-600 transition-colors">Core Web Vitals & Speed</a></li>
              <li><a href="#what-we-check" className="hover:text-blue-600 transition-colors">CRO & Conversion Funnels</a></li>
              <li><a href="#what-we-check" className="hover:text-blue-600 transition-colors">Content & Messaging Silos</a></li>
              <li><a href="#what-we-check" className="hover:text-blue-600 transition-colors">30-Day Growth Roadmap</a></li>
            </ul>
          </div>

          {/* Agency & Enterprise */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">Trikali Agency</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <a href="https://trikali.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
                  Agency Main Site <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://trikali.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
                  Digital Marketing Retainers <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li><Link href="/audit/demo-audit-sample" className="hover:text-blue-600 transition-colors">Interactive Sample Report</Link></li>
              <li><Link href="/admin" className="hover:text-blue-600 transition-colors">Agency Lead Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
          <p>© 2026 Trikali. All rights reserved. Built with precision for SMB and high-growth businesses.</p>
          <div className="flex gap-6">
            <a href="https://trikali.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="https://trikali.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="https://trikali.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">Contact Trikali</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
