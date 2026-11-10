import { WebsiteMeasuredData } from '@/types/audit';

// SSRF Protection: Block private IP ranges, localhost, and non-http(s) schemes
const DISALLOWED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
  /\.internal$/i,
  /\.local$/i,
  /\.localhost$/i,
];

export function validateSafeUrl(rawUrl: string): { valid: boolean; normalizedUrl?: string; error?: string } {
  let urlString = rawUrl.trim();
  if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
    urlString = `https://${urlString}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return { valid: false, error: 'Invalid URL format. Please provide a standard domain or URL.' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only HTTP and HTTPS protocols are supported.' };
  }

  const hostname = parsed.hostname;

  // Check SSRF blocked hosts
  for (const pattern of DISALLOWED_HOST_PATTERNS) {
    if (pattern.test(hostname)) {
      return { valid: false, error: 'Access to local, internal, or loopback network addresses is prohibited.' };
    }
  }

  return { valid: true, normalizedUrl: parsed.toString() };
}

/**
 * Robustly inspects and measures live technical attributes of the target website.
 * Follows redirects securely with size limits and timeouts.
 */
export async function inspectWebsite(rawUrl: string): Promise<WebsiteMeasuredData> {
  const validation = validateSafeUrl(rawUrl);
  if (!validation.valid || !validation.normalizedUrl) {
    throw new Error(validation.error || 'Invalid URL');
  }

  const targetUrl = validation.normalizedUrl;
  const startTime = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000); // 9 second timeout

  let response: Response;
  let html = '';
  let responseTimeMs = 0;
  let httpStatus = 0;
  let isAccessible = false;
  let fetchError: string | undefined;

  try {
    response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 TrikaliGrowthCheck/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);
    responseTimeMs = Date.now() - startTime;
    httpStatus = response.status;
    isAccessible = response.ok;

    // Read max 2.5MB to prevent memory exhaustion
    const reader = response.body?.getReader();
    if (reader) {
      let receivedBytes = 0;
      const chunks: Uint8Array[] = [];
      const MAX_BYTES = 2.5 * 1024 * 1024; // 2.5MB

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          receivedBytes += value.length;
          chunks.push(value);
          if (receivedBytes >= MAX_BYTES) {
            reader.cancel();
            break;
          }
        }
      }
      const fullBuffer = new Uint8Array(receivedBytes);
      let offset = 0;
      for (const chunk of chunks) {
        fullBuffer.set(chunk, offset);
        offset += chunk.length;
      }
      const decoder = new TextDecoder('utf-8');
      html = decoder.decode(fullBuffer);
    } else {
      html = await response.text();
    }
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    responseTimeMs = Date.now() - startTime;
    isAccessible = false;
    const msg = err instanceof Error ? err.message : String(err);
    fetchError = msg.includes('abort') ? 'Website connection timed out after 9 seconds.' : `Could not reach target website: ${msg}`;
    html = '';
  }

  // Parse HTML elements with safe regex-based extraction
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : undefined;

  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : undefined;

  // H1 Tags
  const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  const h1Tags: string[] = [];
  let h1Match;
  while ((h1Match = h1Regex.exec(html)) !== null && h1Tags.length < 5) {
    const cleanH1 = h1Match[1].replace(/<[^>]*>/g, '').trim();
    if (cleanH1) h1Tags.push(cleanH1);
  }

  // H2 and H3 Counts
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

  // Images and Alt attributes
  const imgTags = html.match(/<img[^>]*>/gi) || [];
  const imagesTotal = imgTags.length;
  let imagesWithAlt = 0;
  for (const img of imgTags) {
    if (/alt=["'][^"']+["']/i.test(img)) {
      imagesWithAlt++;
    }
  }
  const imagesMissingAlt = Math.max(0, imagesTotal - imagesWithAlt);

  // Links
  const linkMatches = html.match(/<a[^>]*href=["']([^"']*)["']/gi) || [];
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  const socialLinksDetected: string[] = [];

  const parsedTarget = new URL(targetUrl);
  const hostBase = parsedTarget.hostname.replace(/^www\./, '');

  for (const aTag of linkMatches) {
    const hrefMatch = aTag.match(/href=["']([^"']*)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1].trim();

    if (href.startsWith('#') || href.startsWith('javascript:')) continue;

    if (href.startsWith('/') || href.includes(hostBase)) {
      internalLinksCount++;
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      externalLinksCount++;
      if (href.includes('linkedin.com') && !socialLinksDetected.includes('LinkedIn')) socialLinksDetected.push('LinkedIn');
      if ((href.includes('twitter.com') || href.includes('x.com')) && !socialLinksDetected.includes('X / Twitter')) socialLinksDetected.push('X / Twitter');
      if (href.includes('instagram.com') && !socialLinksDetected.includes('Instagram')) socialLinksDetected.push('Instagram');
      if (href.includes('facebook.com') && !socialLinksDetected.includes('Facebook')) socialLinksDetected.push('Facebook');
      if (href.includes('youtube.com') && !socialLinksDetected.includes('YouTube')) socialLinksDetected.push('YouTube');
    }
  }

  // Meta signals
  const hasViewportMeta = /<meta[^>]*name=["']viewport["']/i.test(html);
  const hasOpenGraph = /<meta[^>]*property=["']og:/i.test(html);
  const hasTwitterCard = /<meta[^>]*name=["']twitter:/i.test(html);
  const hasFavicon = /<link[^>]*rel=["'](icon|shortcut icon)["']/i.test(html);
  const hasHttps = targetUrl.startsWith('https://');

  // Contact signals
  const hasPhone = /tel:|\(\d{3}\)\s*\d{3}-\d{4}|\b\+?[1-9]\d{1,14}\b/i.test(html);
  const hasEmail = /mailto:|[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/i.test(html);
  const hasContactForm = /<form[^>]*>/i.test(html) && /submit|message|email|contact/i.test(html);

  // CTA Buttons
  const buttonMatches = html.match(/<(button|a)[^>]*class=["'][^"']*(?:btn|cta|button)[^"']*["'][^>]*>([\s\S]*?)<\/\1>/gi) || [];
  const ctaButtonTexts: string[] = [];
  for (const btn of buttonMatches.slice(0, 5)) {
    const text = btn.replace(/<[^>]*>/g, '').trim();
    if (text && text.length < 40 && !ctaButtonTexts.includes(text)) {
      ctaButtonTexts.push(text);
    }
  }

  // Approximate Word Count of visible text
  const cleanBody = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const contentWordCount = cleanBody ? cleanBody.split(' ').length : 0;

  // Lightweight check for robots.txt & sitemap
  let hasRobotsTxt = false;
  let hasSitemap = false;
  try {
    const robotsUrl = `${parsedTarget.protocol}//${parsedTarget.host}/robots.txt`;
    const robotsRes = await fetch(robotsUrl, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
    hasRobotsTxt = robotsRes.ok;

    const sitemapUrl = `${parsedTarget.protocol}//${parsedTarget.host}/sitemap.xml`;
    const sitemapRes = await fetch(sitemapUrl, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
    hasSitemap = sitemapRes.ok;
  } catch {
    // Non-critical network checks
  }

  const pageSizeKb = Math.round(new Blob([html]).size / 1024);

  return {
    url: rawUrl,
    normalizedUrl: targetUrl,
    isAccessible,
    httpStatus,
    responseTimeMs,
    pageSizeKb,
    title,
    titleLength: title?.length,
    metaDescription,
    metaDescriptionLength: metaDescription?.length,
    h1Tags,
    h2TagsCount: h2Count,
    h3TagsCount: h3Count,
    imagesTotal,
    imagesWithAlt,
    imagesMissingAlt,
    internalLinksCount,
    externalLinksCount,
    hasViewportMeta,
    hasRobotsTxt,
    hasSitemap,
    hasHttps,
    hasOpenGraph,
    hasTwitterCard,
    hasFavicon,
    hasCtaButtons: ctaButtonTexts.length > 0,
    ctaButtonTexts,
    hasContactSignals: hasPhone || hasEmail || hasContactForm,
    detectedContactMethods: {
      hasPhone,
      hasEmail,
      hasContactForm,
      hasSocialLinks: socialLinksDetected.length > 0,
    },
    socialLinksDetected,
    contentWordCount,
    measuredAt: new Date().toISOString(),
    fetchError,
  };
}

