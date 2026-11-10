'use client';

import { Suspense, useEffect, useState, use } from 'react';
import AuditReportView from '@/components/AuditReportView';
import { AuditReport } from '@/types/audit';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function AuditContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAudit() {
      try {
        const res = await fetch(`/api/audit/${id}`);
        if (!res.ok) {
          throw new Error('Audit report could not be found or has expired.');
        }
        const data = await res.json();
        if (isMounted) {
          setReport(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load audit');
          setLoading(false);
        }
      }
    }

    loadAudit();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#DDF160] animate-spin flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-[#DDF160] animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-white">Loading your audit dashboard...</p>
        <p className="text-xs text-[#838383]">Compiling verified technical diagnostics and growth roadmap.</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Audit Report Not Found</h2>
          <p className="text-xs text-[#ACACAC] mt-1 max-w-sm">
            {error || 'This audit report may have expired or was not generated yet.'}
          </p>
        </div>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-[#DDF160] text-[#161616] text-xs font-bold transition-all shadow-md"
        >
          Generate a Free Audit
        </Link>
      </div>
    );
  }

  return <AuditReportView report={report} />;
}

export default function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#DDF160] animate-spin flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-[#DDF160] animate-pulse" />
          </div>
          <p className="text-sm font-semibold text-white">Loading your audit dashboard...</p>
          <p className="text-xs text-[#838383]">Compiling verified technical diagnostics and growth roadmap.</p>
        </div>
      }
    >
      <AuditContent params={params} />
    </Suspense>
  );
}
