export type AuditGoal =
  | 'leads'
  | 'sales'
  | 'seo'
  | 'brand'
  | 'social'
  | 'cro';

export interface AuditFormData {
  websiteUrl: string;
  businessName: string;
  industry: string;
  country: string;
  targetAudience: string;
  goals: AuditGoal[];
  contactName: string;
  workEmail: string;
  companyName: string;
  consent: boolean;
}

export interface FlaggedImage {
  src: string;
  tagSnippet: string;
  suggestedAlt?: string;
}

export interface WebsiteMeasuredData {
  url: string;
  normalizedUrl: string;
  screenshotUrl: string;
  mobileScreenshotUrl?: string;
  ogImageUrl?: string;
  isAccessible: boolean;
  httpStatus?: number;
  responseTimeMs?: number;
  pageSizeKb?: number;
  title?: string;
  titleLength?: number;
  metaDescription?: string;
  metaDescriptionLength?: number;
  canonicalUrl?: string;
  hasSchemaOrg?: boolean;
  schemaTypes?: string[];
  hasAnalyticsOrPixels?: string[];
  scriptsCount?: number;
  stylesheetsCount?: number;
  h1Tags: string[];
  h2Tags: string[];
  h2TagsCount: number;
  h3TagsCount: number;
  imagesTotal: number;
  imagesWithAlt: number;
  imagesMissingAlt: number;
  flaggedImages: FlaggedImage[];
  internalLinksCount: number;
  externalLinksCount: number;
  hasViewportMeta: boolean;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  hasHttps: boolean;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  hasFavicon: boolean;
  hasCtaButtons: boolean;
  ctaButtonTexts: string[];
  hasContactSignals: boolean;
  detectedContactMethods: {
    hasPhone: boolean;
    hasEmail: boolean;
    hasContactForm: boolean;
    hasSocialLinks: boolean;
  };
  socialLinksDetected: string[];
  contentWordCount: number;
  measuredAt: string;
  fetchError?: string;
}

export interface AuditRecommendation {
  id: string;
  category: 'seo' | 'website' | 'content' | 'conversion' | 'brand' | 'social';
  title: string;
  problem: string;
  whyItMatters: string;
  recommendedAction: string;
  priority: 'High' | 'Medium' | 'Low';
  expectedImpact: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Advanced';
}

export interface ActionPlanItem {
  dayRange: string; // e.g. "Days 1-7", "Days 8-15"
  focusArea: string;
  actionTitle: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface GrowthOpportunity {
  title: string;
  description: string;
  potentialImpact: string;
}

export interface AuditReport {
  id: string;
  businessName: string;
  websiteUrl: string;
  industry: string;
  country: string;
  targetAudience: string;
  goals: string[];
  contactName: string;
  workEmail: string;
  createdAt: string;

  scores: {
    overall: number;
    seo: number;
    website: number;
    content: number;
    conversion: number;
    brand: number;
  };

  executiveSummary: string;
  strengths: string[];
  criticalIssues: string[];
  weaknesses: string[];

  websiteAuditSummary: string;
  seoAuditSummary: string;
  contentAuditSummary: string;
  conversionAuditSummary: string;
  brandPositioningSummary: string;
  socialMediaOpportunities: string[];
  competitorResearchNotes: string;

  topGrowthOpportunities: GrowthOpportunity[];
  recommendations: AuditRecommendation[];
  actionPlan30Days: ActionPlanItem[];

  measuredData: WebsiteMeasuredData;
  source: 'ai_live' | 'ai_fallback_rules';
}

export interface LeadRecord {
  id: string;
  auditId: string;
  contactName: string;
  workEmail: string;
  companyName: string;
  websiteUrl: string;
  industry: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted';
  overallScore: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

