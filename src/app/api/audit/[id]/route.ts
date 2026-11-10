import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Audit ID required' }, { status: 400 });
    }

    // Try memory store first
    let audit = memoryStore.getAudit(id);

    // If not found and Supabase configured, check database
    if (!audit && isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('audits')
        .select(`
          *,
          audit_scores(*)
        `)
        .eq('id', id)
        .single();

      if (data && !error) {
        const scores = data.audit_scores?.[0] || {
          overall: data.overall_score || 70,
          seo: 70,
          website: 70,
          content: 70,
          conversion: 70,
          brand: 70,
        };

        audit = {
          id: data.id,
          businessName: data.contact_name || 'Business Client',
          websiteUrl: data.website_url,
          industry: 'Business',
          country: 'Global',
          targetAudience: 'Prospects',
          goals: ['leads', 'seo'],
          contactName: data.contact_name || 'Business Owner',
          workEmail: data.work_email || '',
          createdAt: data.created_at,
          scores: {
            overall: data.overall_score || scores.overall,
            seo: scores.seo,
            website: scores.website,
            content: scores.content,
            conversion: scores.conversion,
            brand: scores.brand,
          },
          executiveSummary: data.executive_summary || '',
          strengths: data.strengths || [],
          criticalIssues: data.critical_issues || [],
          weaknesses: data.weaknesses || [],
          websiteAuditSummary: data.website_audit_summary || '',
          seoAuditSummary: data.seo_audit_summary || '',
          contentAuditSummary: data.content_audit_summary || '',
          conversionAuditSummary: data.conversion_audit_summary || '',
          brandPositioningSummary: data.brand_positioning_summary || '',
          socialMediaOpportunities: data.social_media_opportunities || [],
          competitorResearchNotes: data.competitor_research_notes || '',
          topGrowthOpportunities: data.top_growth_opportunities || [],
          recommendations: [],
          actionPlan30Days: data.action_plan_30_days || [],
          measuredData: data.measured_data || {},
          source: data.source || 'ai_live',
        };
        memoryStore.saveAudit(audit);
      }
    }

    if (!audit) {
      return NextResponse.json({ error: 'Audit report not found.' }, { status: 404 });
    }

    return NextResponse.json(audit);
  } catch (error) {
    console.error('Fetch audit error:', error);
    return NextResponse.json({ error: 'Failed to retrieve audit report' }, { status: 500 });
  }
}

