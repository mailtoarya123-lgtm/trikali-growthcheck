import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { LeadRecord } from '@/types/audit';

export async function GET() {
  try {
    let leads = memoryStore.getAllLeads();

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error && data.length > 0) {
        leads = data.map((d: Record<string, unknown>) => ({
          id: d.id as string,
          auditId: d.audit_id as string,
          contactName: d.contact_name as string,
          workEmail: d.work_email as string,
          companyName: (d.company_name as string) || (d.contact_name as string),
          websiteUrl: d.website_url as string,
          industry: (d.industry as string) || 'N/A',
          status: (d.status as LeadRecord['status']) || 'New',
          overallScore: (d.overall_score as number) || 70,
          notes: (d.notes as string) || '',
          createdAt: d.created_at as string,
          updatedAt: (d.updated_at as string) || (d.created_at as string),
        }));
      }
    }

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Leads fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, notes } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and Status are required' }, { status: 400 });
    }

    const updated = memoryStore.updateLeadStatus(id, status, notes);

    if (isSupabaseConfigured && supabaseAdmin) {
      await supabaseAdmin
        .from('leads')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

