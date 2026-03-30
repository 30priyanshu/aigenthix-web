/**
 * Sitemap generator — runs after vite build.
 * Generates sitemap.xml into dist/ with all static routes.
 *
 * Usage: node scripts/generate-sitemap.js
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = process.env.VITE_SITE_URL || 'https://aigenthix.com';

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/principles', priority: '0.6', changefreq: 'monthly' },
  { path: '/team', priority: '0.6', changefreq: 'monthly' },
  { path: '/blog', priority: '0.9', changefreq: 'daily' },
  { path: '/research-development', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },

  // Services
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/generative-ai', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/ai-ml', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/robotics', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/humanoids', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/cybersecurity', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/data-engineering', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/blockchain', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/web3', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/software-development', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/iot', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/api-integration', priority: '0.7', changefreq: 'monthly' },

  // Products
  { path: '/products', priority: '0.8', changefreq: 'monthly' },
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

  // Learning & Development
  { path: '/learning-and-development', priority: '0.8', changefreq: 'monthly' },
  { path: '/learning-and-development/data-engineering', priority: '0.7', changefreq: 'monthly' },
  { path: '/learning-and-development/data-analytics', priority: '0.7', changefreq: 'monthly' },
  { path: '/learning-and-development/ai-ml', priority: '0.7', changefreq: 'monthly' },
  { path: '/learning-and-development/generative-ai', priority: '0.7', changefreq: 'monthly' },
  { path: '/learning-and-development/mlops', priority: '0.7', changefreq: 'monthly' },
  { path: '/learning-and-development/agentic-ai', priority: '0.7', changefreq: 'monthly' },
];

const today = new Date().toISOString().split('T')[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

const outPath = resolve(__dirname, '..', 'dist', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf-8');
console.log(`✓ sitemap.xml generated → ${outPath} (${staticRoutes.length} URLs)`);
