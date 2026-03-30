import React from 'react';
import SEO from "../SEO";

// --- Image Imports ---
import trustImage from '../IMAGES/Our Principles images/trust&safety.webp';
import ethicsImage from '../IMAGES/Our Principles images/ai ethics.webp';
import humanImage from '../IMAGES/Our Principles images/humancentric.webp';
import transparencyImage from '../IMAGES/Our Principles images/transparency.webp';
import pioneeringImage from '../IMAGES/Our Principles images/pinoeering.webp';
import innovationImage from '../IMAGES/Our Principles images/innovationn.webp';
import literacyImage from '../IMAGES/Our Principles images/ailiteracy.webp';
import advocacyImage from '../IMAGES/Our Principles images/advocacy.webp';

// --- Constants ---
const MAIN_FONT = "'Playfair Display', Georgia, serif";
const ACCENT_COLOR = '#2D4DE8';

// --- Data ---
const principlesData = [
  { title: "Innovation", description: "Bridging AI and human intelligence to create sustainable and impactful solutions. Websites that are optimized for performance.", image: innovationImage },
  { title: "Trust & Safety", description: "Continuously enhancing AI fairness, security, and ethical implementation.", image: trustImage },
  { title: "Transparency", description: "Building AI solutions that are secure and aligned with ethical principles.", image: transparencyImage },
  { title: "AI Literacy", description: "Empowering industries with knowledge to foster responsible AI adoption.", image: literacyImage },
  { title: "Advocacy", description: "Raising awareness and shaping AI policies that serve humanity.", image: advocacyImage },
  { title: "Pioneering Excellence", description: "Leading the AI revolution with ground-breaking solutions that set us apart from the competition.", image: pioneeringImage },
  { title: "AI Ethics", description: "Ensuring AI solutions align with ethical guidelines to prevent bias and discrimination.", image: ethicsImage },
  { title: "Human-Centered AI", description: "Designing AI solutions that enhance human capabilities rather than replace them.", image: humanImage },
];

// --- Animation ---
const fadeInSlide = `
@keyframes fadeInSlide {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

try {
  const sheet = document.styleSheets[0];
  if (![...sheet.cssRules].some(r => r.cssText.includes('fadeInSlide'))) {
    sheet.insertRule(fadeInSlide, sheet.cssRules.length);
  }
} catch (e) {}

// --- Card ---
const PrincipleCard = ({ principle, index }) => {
  const delay = `${0.4 + index * 0.1}s`;
  const color = index < 4 ? ACCENT_COLOR : '#008080';

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '30px 20px',
        textAlign: 'center',
        boxShadow: '0 5px 20px rgba(0,0,0,.08)',
        transition: 'all .4s ease',
        borderBottom: `4px solid ${color}30`,
        opacity: 0,
        animation: `fadeInSlide .8s ease-out ${delay} forwards`,
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.boxShadow = '0 18px 35px rgba(0,0,0,.2)';
        e.currentTarget.style.borderBottom = `4px solid ${color}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,.08)';
        e.currentTarget.style.borderBottom = `4px solid ${color}30`;
      }}
    >
      <div className="w-24 h-24 mx-auto mb-5 overflow-hidden rounded-full">
        <img src={principle.image} alt={principle.title} className="w-full h-full object-cover" />
      </div>

      <h3 style={{ fontSize: 22, fontWeight: 700, fontFamily: MAIN_FONT, marginBottom: 10 }}>
        {principle.title}
      </h3>

      <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6 }}>
        {principle.description}
      </p>
    </div>
  );
};

// --- Page ---
const OurPrinciples = () => {
  return (
    <>
        <SEO
            title="Core Principles"
            description="Guiding every innovation with a foundation built on ethics, responsibility, and human progress."
        />
    <section className="bg-gray-50 min-h-screen">

      {/* FIXED: Navbar Offset */}
      <div style={{ paddingTop: '60px' }} />

      {/* Hero */}
      <section className="relative about-hero about-hero--compact">
        <div className="hero-overlay" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h1 className="text-5xl lg:text-7xl font-black mb-6">
              Our Core Principles
            </h1>
            <p className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed">
              Guiding every innovation with a foundation built on ethics, responsibility, and human progress.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="max-w-7xl mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {principlesData.map((p, i) => (
            <PrincipleCard key={i} principle={p} index={i} />
          ))}
        </div>
      </div>

    </section>
    </>
  );
};

export default OurPrinciples;
