/**
 * Centralized SEO configuration for AiGENThix.
 * All site-wide SEO constants live here — update once, reflect everywhere.
 */

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://aigenthix.com';

export const seoConfig = {
  siteName: 'AiGENThix',
  siteUrl: SITE_URL,
  defaultTitle: 'AiGENThix — AI Consulting & Development Company',
  defaultDescription:
    'AiGENThix is a leading AI consulting and development company specializing in Generative AI, Machine Learning, Robotics, Data Engineering, and enterprise AI solutions.',
  defaultKeywords:
    'AI consulting, AI development, generative AI, machine learning, data engineering, robotics, ethical AI, enterprise AI, AiGENThix',
  defaultImage: `${SITE_URL}/og-image.jpg`,
  locale: 'en_US',
  twitterHandle: '@aigenthix',
  linkedIn: 'https://www.linkedin.com/company/aigenthix',
  youtube: 'https://www.youtube.com/@aigenthix',

  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AiGENThix',
    url: SITE_URL,
    logo: `${SITE_URL}/faviconlogo.jpeg`,
    description:
      'AI consulting and development company specializing in ethical AI, Generative AI, Machine Learning, Robotics, and enterprise solutions.',
    foundingDate: '2020',
    sameAs: [
      'https://www.linkedin.com/company/aigenthix',
      'https://www.youtube.com/@aigenthix',
      'https://twitter.com/aigenthix',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${SITE_URL}/contact`,
    },
  },

  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AiGENThix',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
};
