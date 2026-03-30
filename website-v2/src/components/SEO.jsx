import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { seoConfig } from '../lib/seo.config';

/**
 * Comprehensive SEO component.
 *
 * @param {string}  title        – Page title (appended with site name via template)
 * @param {string}  description  – Meta description (≤160 chars recommended)
 * @param {string}  keywords     – Comma-separated keywords
 * @param {string}  image        – Absolute URL to OG image
 * @param {string}  url          – Canonical URL override (auto-derived from route if omitted)
 * @param {string}  type         – OG type: "website" | "article" (default: "website")
 * @param {object}  article      – Article-specific OG data { publishedTime, author }
 * @param {object}  structuredData – JSON-LD object (or array of objects) to inject
 * @param {boolean} noIndex      – Set true to block indexing for auth/private pages
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  article,
  structuredData,
  noIndex = false,
}) => {
  const { pathname } = useLocation();
  const siteName = "AiGENThix";
  const siteUrl = seoConfig.siteUrl;
  const canonical = url || `${siteUrl}${pathname}`;
  const pageTitle = title || seoConfig.defaultTitle;
  const pageDescription = description || seoConfig.defaultDescription;
  const pageImage = image || seoConfig.defaultImage;
  const pageKeywords = keywords || seoConfig.defaultKeywords;

  const schemas = Array.isArray(structuredData)
    ? structuredData
    : structuredData
      ? [structuredData]
      : [];

  return (
    <Helmet>
      {/* ── Core ── */}
      <title>{pageTitle} | {siteName}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'} />

      {/* ── Open Graph ── */}
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={seoConfig.locale} />

      {/* ── Article OG (blog posts) ── */}
      {type === 'article' && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === 'article' && article?.author && (
        <meta property="article:author" content={article.author} />
      )}

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seoConfig.twitterHandle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* ── JSON-LD Structured Data ── */}
      {schemas.map((schema, i) => (
        <script key={`ld-${i}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
