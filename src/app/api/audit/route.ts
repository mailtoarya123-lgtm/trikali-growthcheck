import { NextRequest, NextResponse } from 'next/server';
import { inspectWebsite, validateSafeUrl } from '@/lib/analyzer';
import { generateMarketingAudit } from '@/lib/ai-engine';
import { memoryStore } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { AuditFormData, AuditReport, LeadRecord } from '@/types/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      websiteUrl,
      businessName,
      industry,
      country,
      targetAudience,
      goals,
      contactName,
      workEmail,
      companyName,
      consent = true,
    } = body;

    // Strict validation
    if (!websiteUrl || typeof websiteUrl !== 'string') {
      return NextResponse.json({ error: 'Valid website URL is required.' }, { status: 400 });
    }
    if (!workEmail || !workEmail.includes('@')) {
      return NextResponse.json({ error: 'A valid work email is required.' }, { status: 400 });
    }

    const safeUrlCheck = validateSafeUrl(websiteUrl);
    if (!safeUrlCheck.valid || !safeUrlCheck.normalizedUrl) {
      return NextResponse.json({ error: safeUrlCheck.error || 'Invalid or prohibited website URL.' }, { status: 400 });
    }

    // Auto-derive business name from domain if not explicitly provided
    const parsedHost = new URL(safeUrlCheck.normalizedUrl).hostname.replace(/^www\./i, '');
    const derivedBrand = parsedHost
      .split('.')[0]
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const finalBusinessName = (businessName && businessName.trim()) ? businessName.trim() : derivedBrand;

    const formData: AuditFormData = {
      websiteUrl: safeUrlCheck.normalizedUrl,
      businessName: finalBusinessName,
      industry: industry || 'General Business',
      country: country || 'Global',
      targetAudience: targetAudience || 'Potential Customers',
      goals: Array.isArray(goals) && goals.length > 0 ? goals : ['leads', 'seo', 'cro'],
      contactName: contactName || workEmail.split('@')[0],
      workEmail: workEmail.trim().toLowerCase(),
      companyName: companyName || finalBusinessName,
      consent: Boolean(consent),
    };

    // Step 1: Real-time Technical Measurement
    const measuredData = await inspectWebsite(formData.websiteUrl);

    // Step 2: AI & Rule-Driven Analysis
    const auditId = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const auditReport: AuditReport = await generateMarketingAudit(formData, measuredData, auditId);

    // Step 3: Save Lead Record
    const leadRecord: LeadRecord = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      auditId: auditReport.id,
      contactName: formData.contactName,
      workEmail: formData.workEmail,
      companyName: formData.companyName,
      websiteUrl: formData.websiteUrl,
      industry: formData.industry,
      status: 'New',
      overallScore: auditReport.scores.overall,
      notes: `Goals: ${formData.goals.join(', ')}. Target Audience: ${formData.targetAudience}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in memory store for immediate reliable retrieval
    memoryStore.saveAudit(auditReport);
    memoryStore.saveLead(leadRecord);

    // Asynchronously sync to Supabase if configured
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('audits').insert({
          id: auditReport.id,
          website_url: auditReport.websiteUrl,
          status: 'completed',
          overall_score: auditReport.scores.overall,
          executive_summary: auditReport.executiveSummary,
          strengths: auditReport.strengths,
          weaknesses: auditReport.weaknesses,
          critical_issues: auditReport.criticalIssues,
          website_audit_summary: auditReport.websiteAuditSummary,
          seo_audit_summary: auditReport.seoAuditSummary,
          content_audit_summary: auditReport.contentAuditSummary,
          conversion_audit_summary: auditReport.conversionAuditSummary,
          brand_positioning_summary: auditReport.brandPositioningSummary,
          social_media_opportunities: auditReport.socialMediaOpportunities,
          competitor_research_notes: auditReport.competitorResearchNotes,
          top_growth_opportunities: auditReport.topGrowthOpportunities,
          action_plan_30_days: auditReport.actionPlan30Days,
          measured_data: auditReport.measuredData,
          source: auditReport.source,
          contact_name: auditReport.contactName,
          work_email: auditReport.workEmail,
        });

        await supabaseAdmin.from('audit_scores').insert({
          audit_id: auditReport.id,
          overall: auditReport.scores.overall,
          seo: auditReport.scores.seo,
          website: auditReport.scores.website,
          content: auditReport.scores.content,
          conversion: auditReport.scores.conversion,
          brand: auditReport.scores.brand,
        });

        await supabaseAdmin.from('leads').insert({
          id: leadRecord.id,
          audit_id: auditReport.id,
          contact_name: leadRecord.contactName,
          work_email: leadRecord.workEmail,
          company_name: leadRecord.companyName,
          website_url: leadRecord.websiteUrl,
          industry: leadRecord.industry,
          overall_score: leadRecord.overallScore,
          status: leadRecord.status,
          notes: leadRecord.notes,
          consent: formData.consent,
        });
      } catch (dbErr) {
        console.warn('Database sync notification (using memory store fallback):', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      auditId: auditReport.id,
      redirectUrl: `/audit/${auditReport.id}`,
    });
  } catch (error: unknown) {
    console.error('Audit generation error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to process website audit.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

