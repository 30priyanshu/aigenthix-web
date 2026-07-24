/**
 * Sitemap generator — runs after vite build.
 * Generates sitemap.xml into dist/ for deployment and public/ as source-of-truth.
 *
 * Usage: node scripts/generate-sitemap.js
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = (process.env.VITE_SITE_URL || 'https://www.aigenthix.com').replace(/\/$/, '');
const API_URL = (process.env.VITE_API_URL || '').replace(/\/$/, '');
const REQUEST_TIMEOUT_MS = 4000;

const staticRoutes = [
  // Core pages
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/products', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/careers', priority: '0.7', changefreq: 'monthly' },
  { path: '/research-development', priority: '0.7', changefreq: 'monthly' },
  { path: '/principles', priority: '0.6', changefreq: 'monthly' },
  { path: '/team', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms-of-use', priority: '0.5', changefreq: 'yearly' },

  // Services
  { path: '/services/generative-ai', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/ai-ml', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/robotics', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/humanoids', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/cybersecurity', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/data-engineering', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/software-development', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/api-integration', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/blockchain', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/web3', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/iot', priority: '0.8', changefreq: 'monthly' },

  // Products
  { path: '/products/sahayak-ai', priority: '0.7', changefreq: 'monthly' },
  { path: '/products/video-translation', priority: '0.7', changefreq: 'monthly' },
  { path: '/products/ai-interviewer', priority: '0.7', changefreq: 'monthly' },
  { path: '/products/project-management', priority: '0.7', changefreq: 'monthly' },

  // Industries
  { path: '/industries', priority: '0.8', changefreq: 'monthly' },
  { path: '/industries/healthcare', priority: '0.7', changefreq: 'monthly' },
  { path: '/industries/finance', priority: '0.7', changefreq: 'monthly' },
  { path: '/industries/education', priority: '0.7', changefreq: 'monthly' },
  { path: '/industries/enterprise-solutions', priority: '0.7', changefreq: 'monthly' },
  { path: '/industries/manufacturing', priority: '0.7', changefreq: 'monthly' },
  { path: '/industries/retail-ecommerce', priority: '0.7', changefreq: 'monthly' },

  // Learning & Development courses
  { path: '/learning-and-development', priority: '0.8', changefreq: 'monthly' },
  { path: '/learning-and-development/data-engineering', priority: '0.7', changefreq: 'monthly' },
  { path: '/learning-and-development/data-analytics', priority: '0.7', changefreq: 'monthly' },
  { path: '/learning-and-development/ai-ml', priority: '0.7', changefreq: 'monthly' },
  { path: '/learning-and-development/generative-ai', priority: '0.7', changefreq: 'monthly' },
  { path: '/learning-and-development/mlops', priority: '0.7', changefreq: 'monthly' },
  { path: '/learning-and-development/agentic-ai', priority: '0.7', changefreq: 'monthly' },
];

const today = new Date().toISOString().split('T')[0];

function formatISODate(value, fallback = today) {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toISOString().split('T')[0];
}

async function fetchPublishedBlogRoutes() {
  if (!API_URL) return [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}/api/blogs/page-data`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Blog API responded with status ${response.status}`);
    }

    const payload = await response.json();
    const data = payload?.data || {};
    const candidates = [data.featured, ...(data.latest || []), ...(data.popular || [])].filter(Boolean);
    const bySlug = new Map();

    for (const post of candidates) {
      const slug = String(post?.slug || '').trim();
      if (!slug || bySlug.has(slug)) continue;

      bySlug.set(slug, {
        path: `/blog/${slug}`,
        priority: '0.6',
        changefreq: 'monthly',
        lastmod: formatISODate(post?.updated_at || post?.created_at),
      });
    }

    return Array.from(bySlug.values());
  } catch (error) {
    console.warn(`⚠️ Unable to fetch blog slugs from API. Continuing with static routes only. (${error.message})`);
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildXml(routes) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod || today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

async function main() {
  const staticRouteEntries = staticRoutes.map((route) => ({ ...route, lastmod: today }));
  const blogRoutes = await fetchPublishedBlogRoutes();
  const xml = buildXml([...staticRouteEntries, ...blogRoutes]);

  const outputPaths = [
    resolve(__dirname, '..', 'dist', 'sitemap.xml'),
    resolve(__dirname, '..', 'public', 'sitemap.xml'),
  ];

  for (const outPath of outputPaths) {
    writeFileSync(outPath, xml, 'utf-8');
  }

  console.log(`✓ sitemap.xml generated (${staticRouteEntries.length + blogRoutes.length} URLs)`);
  for (const outPath of outputPaths) {
    console.log(`  → ${outPath}`);
  }
}

main().catch((error) => {
  console.error('Failed to generate sitemap.xml', error);
  process.exit(1);
});
