// SEO helper functions for Project Iron

/**
 * Returns a formatted title for the page.
 * @param pageTitle - The page-specific title
 * @param siteName - The site name (default: 'Project Iron')
 */
export function titleTemplate(pageTitle: string, siteName = 'Project Iron'): string {
  return pageTitle ? `${pageTitle} | ${siteName}` : siteName;
}

/**
 * Returns a full Open Graph image URL
 * @param url - The image path or URL
 * @param site - The site base URL (default: 'https://YOUR_DOMAIN')
 */
export function ogImage(url: string, site = 'https://YOUR_DOMAIN'): string {
  try {
    return new URL(url, site).href;
  } catch {
    return url;
  }
}

/**
 * Builds a JSON-LD object for SEO structured data
 * @param type - The schema.org type (e.g., 'WebSite', 'Article')
 * @param data - Additional properties for the schema
 */
export function buildJsonLd(type: string, data: Record<string, any>): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
}
