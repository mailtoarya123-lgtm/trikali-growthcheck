-- ==============================================================================
-- Trikali GrowthCheck Database Schema (PostgreSQL / Supabase)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES (Linked with Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BUSINESSES
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  industry TEXT,
  country TEXT,
  target_audience TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AUDITS
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  website_url TEXT NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  executive_summary TEXT,
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  critical_issues JSONB DEFAULT '[]'::jsonb,
  website_audit_summary TEXT,
  seo_audit_summary TEXT,
  content_audit_summary TEXT,
  conversion_audit_summary TEXT,
  brand_positioning_summary TEXT,
  social_media_opportunities JSONB DEFAULT '[]'::jsonb,
  competitor_research_notes TEXT,
  top_growth_opportunities JSONB DEFAULT '[]'::jsonb,
  action_plan_30_days JSONB DEFAULT '[]'::jsonb,
  measured_data JSONB DEFAULT '{}'::jsonb,
  source TEXT DEFAULT 'ai_live',
  contact_name TEXT,
  work_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUDIT SCORES
CREATE TABLE IF NOT EXISTS audit_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  overall INTEGER NOT NULL,
  seo INTEGER NOT NULL,
  website INTEGER NOT NULL,
  content INTEGER NOT NULL,
  conversion INTEGER NOT NULL,
  brand INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AUDIT RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS audit_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')),
  expected_impact TEXT CHECK (expected_impact IN ('High', 'Medium', 'Low')),
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LEADS (For Trikali Agency Lead Management)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID REFERENCES audits(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  company_name TEXT,
  website_url TEXT NOT NULL,
  industry TEXT,
  overall_score INTEGER,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted')),
  notes TEXT,
  consent BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SUBSCRIPTIONS (For Stripe future tiers)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'Free' CHECK (plan IN ('Free', 'Growth', 'Agency')),
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audits_website_url ON audits(website_url);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_work_email ON leads(work_email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read for audits by ID (allows anonymous audit viewers with their direct audit ID link)
CREATE POLICY "Audits are readable by ID" ON audits FOR SELECT USING (true);
CREATE POLICY "Audit scores are readable" ON audit_scores FOR SELECT USING (true);
CREATE POLICY "Audit recommendations readable" ON audit_recommendations FOR SELECT USING (true);

-- Leads are only manageable by Admins or Service Role
CREATE POLICY "Leads accessible by admin" ON leads FOR ALL USING (
  auth.jwt() ->> 'role' = 'service_role' OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

