/**
 * Reusable JSON-LD schema generators for structured data.
 */
import { seoConfig } from './seo.config';

/**
 * BreadcrumbList schema.
 * @param {Array<{name: string, path: string}>} items
 */
export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: seoConfig.siteUrl },
    ...items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: item.name,
      item: `${seoConfig.siteUrl}${item.path}`,
    })),
  ],
});

/**
 * Service schema for service pages.
 * @param {{name: string, description: string, path: string}} service
 */
export const serviceSchema = ({ name, description, path }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  provider: {
    '@type': 'Organization',
    name: 'AiGENThix',
    url: seoConfig.siteUrl,
  },
  url: `${seoConfig.siteUrl}${path}`,
  areaServed: 'Worldwide',
});

