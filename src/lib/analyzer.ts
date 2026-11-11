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

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/gi, '&')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/\s+/g, ' ')
    .trim();
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
  const title = titleMatch ? decodeHtmlEntities(titleMatch[1]) : undefined;

  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const metaDescription = metaDescMatch ? decodeHtmlEntities(metaDescMatch[1]) : undefined;

  // H1 Tags
  const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  const h1Tags: string[] = [];
  let h1Match;
  while ((h1Match = h1Regex.exec(html)) !== null && h1Tags.length < 5) {
    const cleanH1 = decodeHtmlEntities(h1Match[1].replace(/<[^>]*>/g, ''));
    h1Tags.push(cleanH1);
  }

  // H2 and H3 Tags
  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const h2Tags: string[] = [];
  let h2Match;
  while ((h2Match = h2Regex.exec(html)) !== null && h2Tags.length < 15) {
    const cleanH2 = decodeHtmlEntities(h2Match[1].replace(/<[^>]*>/g, ''));
    if (cleanH2 && !h2Tags.includes(cleanH2)) {
      h2Tags.push(cleanH2);
    }
  }
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

  // Open Graph & Social preview image
  const ogImgMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                     html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  let ogImageUrl = ogImgMatch ? decodeHtmlEntities(ogImgMatch[1]) : undefined;
  if (ogImageUrl && ogImageUrl.startsWith('//')) {
    ogImageUrl = `https:${ogImageUrl}`;
  } else if (ogImageUrl && ogImageUrl.startsWith('/')) {
    ogImageUrl = new URL(ogImageUrl, targetUrl).href;
  }

  // Images and Alt attributes with visual flagging (missing alt, generic alt, missing CLS dimensions, or unoptimized format)
  const imgRegex = /<img[^>]+(?:src|data-manual-src|data-src)=["']([^"']+)["'][^>]*>/gi;
  const flaggedImages: {
    src: string;
    tagSnippet: string;
    suggestedAlt?: string;
    currentAlt?: string;
    issueType?: 'missing_alt' | 'generic_alt' | 'missing_dimensions' | 'unoptimized_format';
    issueLabel?: string;
  }[] = [];
  let imagesTotal = 0;
  let imagesWithAlt = 0;
  let imgMatch;

  const genericAltPattern = /^(image|img|photo|picture|hero image|hero|banner|icon|graphic|placeholder|untitled|logo|thumb|thumbnail|background|bg|\d+)$/i;

  while ((imgMatch = imgRegex.exec(html)) !== null) {
    imagesTotal++;
    const fullTag = imgMatch[0];
    let src = decodeHtmlEntities(imgMatch[1]);

    if (!src.startsWith('data:')) {
      try {
        src = new URL(src, targetUrl).href;
      } catch {
        // keep as-is if invalid URL
      }
    }

    const hasAlt = /alt=["']([^"']*)["']/i.test(fullTag);
    const altVal = hasAlt ? decodeHtmlEntities(fullTag.match(/alt=["']([^"']*)["']/i)?.[1] || '') : '';
    const hasWidthHeight = /\bwidth=["']?\d+/i.test(fullTag) && /\bheight=["']?\d+/i.test(fullTag);
    const isGenericAlt = altVal.length > 0 && (genericAltPattern.test(altVal.trim()) || altVal.trim().length < 4);

    if (hasAlt && altVal.length > 0 && !isGenericAlt) {
      imagesWithAlt++;
    }

    const alreadyFlagged = flaggedImages.some(f => f.src.split('?')[0] === src.split('?')[0]);
    if (!alreadyFlagged && flaggedImages.length < 8 && !src.startsWith('data:')) {
      const rawFilename = src.split('/').pop()?.split('?')[0] || 'brand-visual';
      const cleanName = rawFilename
        .replace(/\.(png|jpg|jpeg|webp|gif|svg)$/i, '')
        .replace(/_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, '')
        .replace(/_\d+x\d+/i, '')
        .replace(/[-_]+/g, ' ')
        .trim();
      const isReadable = /[a-zA-Z]{3,}/.test(cleanName);
      const baseTitle = title ? title.split('|')[0].split('-')[0].trim() : '';

      if (!hasAlt || altVal.length === 0) {
        flaggedImages.push({
          src,
          tagSnippet: fullTag.length > 130 ? `${fullTag.slice(0, 127)}...>` : fullTag,
          currentAlt: '(empty / missing)',
          issueType: 'missing_alt',
          issueLabel: 'Missing Alt Attribute (Unindexed by Google Images)',
          suggestedAlt: isReadable ? `${baseTitle ? baseTitle + ' — ' : ''}${cleanName}` : `${baseTitle || 'Brand'} product & service visual`,
        });
      } else if (isGenericAlt) {
        flaggedImages.push({
          src,
          tagSnippet: fullTag.length > 130 ? `${fullTag.slice(0, 127)}...>` : fullTag,
          currentAlt: altVal,
          issueType: 'generic_alt',
          issueLabel: `Weak Generic Alt ("${altVal}") — Wastes Keyword Signal`,
          suggestedAlt: isReadable ? `${baseTitle ? baseTitle + ' — ' : ''}${cleanName}` : `${baseTitle || 'Enterprise'} solution showcase`,
        });
      } else if (!hasWidthHeight) {
        flaggedImages.push({
          src,
          tagSnippet: fullTag.length > 130 ? `${fullTag.slice(0, 127)}...>` : fullTag,
          currentAlt: altVal,
          issueType: 'missing_dimensions',
          issueLabel: 'Missing Width/Height Attributes (Core Web Vitals CLS Risk)',
          suggestedAlt: altVal,
        });
      }
    }
  }

  const imagesMissingAlt = Math.max(0, imagesTotal - imagesWithAlt);
  const encodedTarget = encodeURIComponent(targetUrl);
  const screenshotUrl = `https://api.microlink.io/?url=${encodedTarget}&screenshot=true&meta=false&embed=screenshot.url`;
  const mobileScreenshotUrl = `https://api.microlink.io/?url=${encodedTarget}&screenshot=true&viewport.width=390&viewport.height=844&viewport.isMobile=true&meta=false&embed=screenshot.url`;

  // Canonical URL
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
                         html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : undefined;

  // Schema.org / JSON-LD Structured Data
  const schemaTypes: string[] = [];
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jsonLdMatch;
  while ((jsonLdMatch = jsonLdRegex.exec(html)) !== null) {
    const rawJson = jsonLdMatch[1];
    const typeMatches = rawJson.match(/"@type"\s*:\s*"([^"]+)"/g) || [];
    for (const tm of typeMatches) {
      const tVal = tm.replace(/"@type"\s*:\s*"/, '').replace(/"$/, '').trim();
      if (tVal && !schemaTypes.includes(tVal)) {
        schemaTypes.push(tVal);
      }
    }
  }
  const hasSchemaOrg = schemaTypes.length > 0 || /itemtype=["']https?:\/\/schema\.org/i.test(html);

  // Analytics & Marketing Pixels
  const hasAnalyticsOrPixels: string[] = [];
  if (/googletagmanager\.com|gtag\(|G-[A-Z0-9]+|UA-\d+/i.test(html)) hasAnalyticsOrPixels.push('Google Analytics / GTM');
  if (/connect\.facebook\.net|fbq\(/i.test(html)) hasAnalyticsOrPixels.push('Meta Pixel');
  if (/klaviyo/i.test(html)) hasAnalyticsOrPixels.push('Klaviyo');
  if (/hotjar/i.test(html)) hasAnalyticsOrPixels.push('Hotjar');
  if (/clarity\.ms/i.test(html)) hasAnalyticsOrPixels.push('Microsoft Clarity');
  if (/shopify/i.test(html)) hasAnalyticsOrPixels.push('Shopify Commerce');
  if (/hubspot/i.test(html)) hasAnalyticsOrPixels.push('HubSpot');
  if (/tiktok/i.test(html) && /analytics|pixel/i.test(html)) hasAnalyticsOrPixels.push('TikTok Pixel');

  // Scripts & Stylesheets count
  const scriptsCount = (html.match(/<script[^>]*src=/gi) || []).length;
  const stylesheetsCount = (html.match(/<link[^>]*rel=["']stylesheet["']/gi) || []).length;

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

  // CTA Buttons - check classes and common interactive elements
  const buttonMatches = html.match(/<(button|a)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
  const ctaButtonTexts: string[] = [];
  const ctaKeywords = /shop|buy|cart|book|schedule|get|start|free|contact|demo|quote|join|subscribe|order|explore|discover|learn more|sign up|add to|try|call|audit/i;
  for (const btn of buttonMatches) {
    const isBtnTag = /^<button/i.test(btn);
    const hasBtnClass = /class=["'][^"']*(?:btn|cta|button|primary|action|submit)[^"']*["']/i.test(btn);
    const text = btn.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (!text || text.length < 2 || text.length > 36) continue;
    if ((isBtnTag || hasBtnClass || ctaKeywords.test(text)) && !ctaButtonTexts.includes(text)) {
      ctaButtonTexts.push(text);
      if (ctaButtonTexts.length >= 8) break;
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
    screenshotUrl,
    mobileScreenshotUrl,
    ogImageUrl,
    isAccessible,
    httpStatus,
    responseTimeMs,
    pageSizeKb,
    title,
    titleLength: title?.length,
    metaDescription,
    metaDescriptionLength: metaDescription?.length,
    canonicalUrl,
    hasSchemaOrg,
    schemaTypes,
    hasAnalyticsOrPixels,
    scriptsCount,
    stylesheetsCount,
    h1Tags,
    h2Tags,
    h2TagsCount: h2Count,
    h3TagsCount: h3Count,
    imagesTotal,
    imagesWithAlt,
    imagesMissingAlt,
    flaggedImages,
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

