/**
 * Verifies public React routes stay listed in the static sitemap route config.
 */
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appPath = resolve(__dirname, '..', 'src', 'App.jsx');
const sitemapPath = resolve(__dirname, 'generate-sitemap.js');

const privateRoutes = new Set(['/sign-in', '/create-account', '/reset-password', '/my-account']);

function extractMatches(source, regex) {
  const results = [];
  let match;
  while ((match = regex.exec(source)) !== null) {
    results.push(match[1]);
  }
  return results;
}

const appSource = readFileSync(appPath, 'utf-8');
const sitemapSource = readFileSync(sitemapPath, 'utf-8');

const publicRoutes = extractMatches(appSource, /<Route\s+path="([^"]+)"/g)
  .filter((route) => !route.includes(':'))
  .filter((route) => route !== '*')
  .filter((route) => !privateRoutes.has(route))
  .sort();

const sitemapRoutes = extractMatches(sitemapSource, /\{\s*path:\s*'([^']+)'/g).sort();

const missing = publicRoutes.filter((route) => !sitemapRoutes.includes(route));
const extra = sitemapRoutes.filter((route) => !publicRoutes.includes(route));

if (missing.length || extra.length) {
  console.error('Sitemap route drift detected.');
  if (missing.length) console.error(`Missing from sitemap: ${missing.join(', ')}`);
  if (extra.length) console.error(`Extra in sitemap: ${extra.join(', ')}`);
  process.exit(1);
}

console.log(`✓ Sitemap routes match public React routes (${publicRoutes.length} routes)`);
