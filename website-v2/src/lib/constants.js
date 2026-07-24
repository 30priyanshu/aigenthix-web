export const BRAND = {
  NAME: 'AiGENThix',
  ADDRESS_LINE: 'HSR Layout, Bengaluru, Karnataka, India',
  PRIMARY_EMAIL: 'info@aigenthix.com',
  SECONDARY_EMAIL: 'aigenthix@gmail.com',
  PHONE: '+91 7006951124',
};

export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com',
  LINKEDIN: 'https://linkedin.com',
  INSTAGRAM: 'https://instagram.com',
};

export const NAV_PRODUCTS = [
  { title: 'Sahayak AI', to: '/products/sahayak-ai' },
  { title: 'Video Translation', to: '/products/video-translation' },
  { title: 'AI Interviewer', to: '/products/ai-interviewer' },
  { title: 'Project Management', to: '/products/project-management' },
];

export const NAV_SERVICES = [
  { title: 'Generative AI', to: '/services/generative-ai' },
  { title: 'Artificial Intelligence & ML', to: '/services/ai-ml' },
  { title: 'Data Engineering', to: '/services/data-engineering' },
  { title: 'Software Development', to: '/services/software-development' },
  { title: 'Robotics', to: '/services/robotics' },
  { title: 'Cybersecurity', to: '/services/cybersecurity' },
];

export const NAV_INDUSTRIES = [
  { title: 'Healthcare', to: '/industries/healthcare' },
  { title: 'Finance', to: '/industries/finance' },
  { title: 'Retail & E-commerce', to: '/industries/retail-ecommerce' },
  { title: 'Manufacturing', to: '/industries/manufacturing' },
  { title: 'Education', to: '/industries/education' },
  { title: 'Enterprise Solutions', to: '/industries/enterprise-solutions' },
];

export const NAV_COMPANY_MORE = [
  { title: 'OUR CORE PRINCIPLES', to: '/principles' },
  { title: 'OUR TEAM', to: '/team' },
  { title: 'CONTACT US', to: '/contact' },
  { title: 'BLOG', to: '/blog' },
];

export const NAV_ACCOUNT = [
  { title: 'SIGN IN', to: '/sign-in' },
  { title: 'CREATE ACCOUNT', to: '/create-account' },
  { title: 'MY ACCOUNT', to: '/my-account' },
];

const normalizeSearchEntries = (entries) =>
  entries.map(({ label, to, category, keywords = [] }) => ({
    label,
    to,
    category,
    keywords: [...new Set([label, to, ...keywords].map((value) => value.toLowerCase().trim()))],
  }));

export const SEARCH_INDEX = normalizeSearchEntries([
  ...NAV_PRODUCTS.map(({ title, to }) => ({ label: title, to, category: 'products' })),
  ...NAV_SERVICES.map(({ title, to }) => ({ label: title, to, category: 'services' })),
  ...NAV_INDUSTRIES.map(({ title, to }) => ({ label: title, to, category: 'industries' })),
  { label: 'Products', to: '/products', category: 'products', keywords: ['product'] },
  { label: 'Services', to: '/services', category: 'services', keywords: ['service'] },
  { label: 'Industries', to: '/industries', category: 'industries', keywords: ['industry'] },
  { label: 'Learning and Development', to: '/learning-and-development', category: 'learning' },
  { label: 'Data Engineering Learning', to: '/learning-and-development/data-engineering', category: 'learning' },
  { label: 'Data Analytics Learning', to: '/learning-and-development/data-analytics', category: 'learning' },
  { label: 'AI ML Learning', to: '/learning-and-development/ai-ml', category: 'learning', keywords: ['ai', 'ml'] },
  { label: 'Generative AI Learning', to: '/learning-and-development/generative-ai', category: 'learning' },
  { label: 'MLOps Learning', to: '/learning-and-development/mlops', category: 'learning' },
  { label: 'Agentic AI Learning', to: '/learning-and-development/agentic-ai', category: 'learning' },
  { label: 'About', to: '/about', category: 'company' },
  { label: 'Our Principles', to: '/principles', category: 'company' },
  { label: 'Our Team', to: '/team', category: 'company' },
  { label: 'Research and Development', to: '/research-development', category: 'company', keywords: ['rnd'] },
  { label: 'Blog', to: '/blog', category: 'company', keywords: ['blogs'] },
  { label: 'Careers', to: '/careers', category: 'company', keywords: ['career', 'jobs'] },
  { label: 'Contact', to: '/contact', category: 'company', keywords: ['contact us'] },
]);
