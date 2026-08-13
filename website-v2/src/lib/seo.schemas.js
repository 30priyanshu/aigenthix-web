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

/**
 * WebApplication schema for products/software.
 * @param {{name: string, description: string, path: string, applicationCategory?: string, operatingSystem?: string}} app
 */
export const webApplicationSchema = ({ name, description, path, applicationCategory = 'SaaS', operatingSystem = 'All' }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name,
  url: `${seoConfig.siteUrl}${path}`,
  description,
  applicationCategory,
  operatingSystem,
  offers: {
    '@type': 'Offer',
    availability: 'http://schema.org/InStock',
    price: '0',
    priceCurrency: 'INR'
  }
});

/**
 * CollectionPage/Blog schema for listing pages.
 * @param {{name: string, description: string, path: string}} page
 */
export const collectionPageSchema = ({ name, description, path }) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  url: `${seoConfig.siteUrl}${path}`,
  publisher: {
    '@type': 'Organization',
    name: 'AiGENThix',
    logo: { '@type': 'ImageObject', url: `${seoConfig.siteUrl}/faviconlogo.jpeg` }
  }
});

/**
 * Article schema for R&D or general content pages.
 * @param {{name: string, description: string, path: string, image?: string}} article
 */
export const articleSchema = ({ name, description, path, image }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: name,
  description: description,
  url: `${seoConfig.siteUrl}${path}`,
  image: image || seoConfig.defaultImage,
  author: {
    '@type': 'Organization',
    name: 'AiGENThix'
  },
  publisher: {
    '@type': 'Organization',
    name: 'AiGENThix',
    logo: { '@type': 'ImageObject', url: `${seoConfig.siteUrl}/faviconlogo.jpeg` }
  }
});

/**
 * WebPage schema for generic pages like Industries.
 * @param {{name: string, description: string, path: string}} page
 */
export const webPageSchema = ({ name, description, path }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name,
  description,
  url: `${seoConfig.siteUrl}${path}`
});
