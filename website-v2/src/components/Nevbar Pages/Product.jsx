import React from 'react';
import { Link } from 'react-router-dom';
import SEO from "../SEO";
import { breadcrumbSchema } from "../../lib/seo.schemas";


// Images (ONLY 4)
import sahyakAIImg from '../IMAGES/Products page images/sahayak ai.webp';
import videoTranslationImg from '../IMAGES/Products page images/video translation.webp';
import aiInterviewerImg from '../IMAGES/Products page images/ai interviewer.webp';
import projectManagementImg from '../IMAGES/Products page images/project.webp';

const MAIN_FONT = "'Playfair Display', Georgia, serif";

// ✅ ONLY 4 PRODUCTS
const products = [
  {
    id: 1,
    title: 'Sahayak AI',
    description:
      'An enterprise-grade AI assistant that automates workflows, fetches contextual insights, and boosts operational efficiency across teams.',
    image: sahyakAIImg,
    route: '/products/sahayak-ai',
  },
  {
    id: 2,
    title: 'Video Translation AI',
    description:
      'AI-powered real-time video translation and voice localization to help businesses connect with global audiences effortlessly.',
    image: videoTranslationImg,
    route: '/products/video-translation',
  },
  {
    id: 3,
    title: 'AI Interviewer',
    description:
      'Smart AI interviewer that evaluates candidates using NLP, behavioral analysis, and skill-based assessment.',
    image: aiInterviewerImg,
    route: '/products/ai-interviewer',
  },
  {
    id: 4,
    title: 'Project Management Tool',
    description:
      'AI-enhanced project management with intelligent planning, risk prediction, and resource optimization.',
    image: projectManagementImg,
    route: '/products/project-management',
  },
];

const ProductHero = () => (
  <section className="relative about-hero about-hero--compact">
    <div style={{ paddingTop: "60px" }} />
      <div className="hero-overlay" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg" style={{ fontFamily: MAIN_FONT }}>
        Our Products
      </h1>
      <p className="text-lg sm:text-xl text-gray-100 max-w-4xl mx-auto mb-10 leading-relaxed opacity-90">
        Discover transformative AI solutions meticulously crafted to propel businesses forward. From visionary assistants to precision-engineered tools, ignite innovation and achieve sustainable excellence.
      </p>
    </div>
  </section>
);

const ProductCard = ({ product }) => (
  <Link
    to={product.route}
    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
  >
    {/* Image */}
    <div className="relative h-56 overflow-hidden">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </div>

    {/* Content */}
    <div className="p-6 flex flex-col flex-grow">
      <h3
        className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors"
        style={{ fontFamily: MAIN_FONT }}
      >
        {product.title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed flex-grow">
        {product.description}
      </p>

      <div className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-all">
        Explore Product
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </Link>
);

const ProductsPage = () => {
  return (
    <>
      <SEO
        title="AI Products - Sahayak AI, Video Translation & More"
        description="Explore AiGENThix AI products: Sahayak AI assistant, Video Translation AI, AI Interviewer, and Project Management tools built for modern businesses."
        keywords="AI products, Sahayak AI, video translation AI, AI interviewer, project management tool, AiGENThix products"
        structuredData={breadcrumbSchema([{ name: 'Products', path: '/products' }])}
      />

      <div className="min-h-screen bg-gray-50">
        <ProductHero />

        {/* Products Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};


export default ProductsPage;
