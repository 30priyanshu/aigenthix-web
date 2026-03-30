import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEO from "../SEO";


// Image imports - make sure these paths are correct
import enterpriseImg from '../IMAGES/Home Page images/Industries images/enterprise.webp';
import financialImg from '../IMAGES/Home Page images/Industries images/financial.webp';
import healthcareImg from '../IMAGES/Home Page images/Industries images/healthcare.webp';
import educationImg from '../IMAGES/Home Page images/Industries images/education.webp';
import retailImg from '../IMAGES/Home Page images/Industries images/retail &ecommerce.webp';
import manufacturingImg from '../IMAGES/Home Page images/Industries images/manifacturing intelligence.webp';
// ✅ Updated Sequence Order Here
const industriesData = [
  {
    id: 6,
    slug: "enterprise-solutions",
    title: "Enterprise Solutions",
    description:
      "Crafting custom AI agents and automation tools for HR, legal, and operational processes to drive enterprise-wide efficiency.",
    image: enterpriseImg,
  },
  {
    id: 2,
    slug: "finance",
    title: "Financial Services AI",
    description:
      "Implementing fraud detection, personalized wealth management, and automated risk assessment for robust financial operations.",
    image: financialImg,
  },
  {
    id: 1,
    slug: "healthcare",
    title: "Healthcare AI Solutions",
    description:
      "Developing intelligent diagnostics, predictive patient care systems, and streamlined clinical workflows to transform health outcomes.",
    image: healthcareImg,
  },
  {
    id: 5,
    slug: "education",
    title: "Education Technology",
    description:
      "Creating adaptive learning platforms, automated grading systems, and personalized tutoring solutions for students.",
    image: educationImg,
  },
  {
    id: 3,
    slug: "retail-ecommerce",
    title: "Retail & E-commerce",
    description:
      "Building hyper-personalized recommendation engines, dynamic pricing tools, and supply chain optimization systems.",
    image: retailImg,
  },
  {
    id: 4,
    slug: "manufacturing",
    title: "Manufacturing Intelligence",
    description:
      "Applying AI for predictive maintenance, quality control automation, and efficiency gains across the entire production line.",
    image: manufacturingImg,
  },
];

const TEXT_SHADOW_CLASS = 'text-shadow';

// --- Card Component (Unchanged) ---
const CreativeCard = ({ industry }) => (
  <div
    className="group relative h-[400px] rounded-2xl overflow-hidden shadow-2xl \
                     transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-blue-500/70 \
                     bg-blue-900/30 w-full"
  >
    {/* Background Image */}
    <img
      src={industry.image}
      alt={`${industry.title} industry solution`}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />

    {/* Dark gradient overlay */}
    <div
      className="absolute inset-0 
  bg-gradient-to-t 
  from-black/80 via-black/40 to-transparent"
    />

    {/* Content Area */}
    <div className="relative p-8 h-full flex flex-col justify-end text-white">
      <h3
        className={`text-3xl font-extrabold mb-3 leading-snug text-white transition-colors duration-300 ${TEXT_SHADOW_CLASS}`}
      >
        {industry.title}
      </h3>

      <p
        className={`text-sm text-blue-200 mb-6 max-h-0 opacity-0 
                             transition-all duration-500 ease-in-out 
                             group-hover:max-h-24 group-hover:opacity-100 ${TEXT_SHADOW_CLASS}`}
      >
        {industry.description}
      </p>

      <Link
        to={`/industries/${industry.slug}`}
        className="inline-flex items-center text-sm font-bold tracking-wider uppercase
             text-white border-b-2 border-transparent transition-all duration-300 
             group-hover:text-blue-300 group-hover:border-blue-300"
      >
        Explore Solution
        <svg
          className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  </div>
);

// --- Main Component ---
const Industries = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // Determines if on a mobile breakpoint (md breakpoint at 768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoize slide functions (Unchanged)
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === industriesData.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? industriesData.length - 1 : prevIndex - 1
    );
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Touch/drag support (only on mobile) (Unchanged)
  useEffect(() => {
    if (!isMobile || !carouselRef.current) return;

    let startX = 0;
    let isDragging = false;
    const carousel = carouselRef.current;
    let slideWidth = carousel.clientWidth;

    const handleResize = () => {
      slideWidth = carousel.clientWidth;
    };
    window.addEventListener('resize', handleResize);

    const handleTouchStart = (e) => {
      isDragging = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      carousel.style.transition = 'none';
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const currentX = e.touches ? e.touches[0].clientX : e.clientX;
      const diff = currentX - startX;
      carousel.style.transform = `translateX(calc(-${
        currentIndex * 100
      }% + ${diff}px))`;
    };

    const handleTouchEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.transition = 'transform 0.4s ease';

      const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const diff = endX - startX;
      const threshold = slideWidth / 4;

      if (diff < -threshold) {
        nextSlide();
      } else if (diff > threshold) {
        prevSlide();
      } else {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    };

    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
      carousel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, currentIndex, nextSlide, prevSlide]);

 return (
    <>
        <SEO
            title="Industries"
            description="With 15 years of expertise in building a wide range of custom
            software, we have assisted numerous industries in unlocking new
            value, fostering trust, and promoting transparency across their
            businesses."
        />
    <div className="min-h-screen bg-white font-['Poppins',_sans-serif]">
      {/* Hero Section */}
      <section className="relative py-16 about-hero">
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 pt-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 animate-fadeInDown">
            <span className="text-blue-300 italic">Innovative</span> Solutions
            For Global <span className="text-blue-300 italic">Industries</span>
          </h1>
          <p className="text-xl text-gray-100 max-w-4xl mx-auto leading-relaxed mt-4">
            With 15 years of expertise in building a wide range of custom
            software, we have assisted numerous industries in unlocking new
            value, fostering trust, and promoting transparency across their
            businesses.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Desktop Grid */}
        {!isMobile && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {industriesData.map((industry) => (
              <CreativeCard key={industry.id} industry={industry} />
            ))}
          </div>
        )}

        {/* Mobile Carousel */}
        {isMobile && (
          <div className="relative mx-[-1rem] sm:mx-[-1.5rem] px-4 sm:px-6">
            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 w-10 h-10 rounded-full shadow-xl border border-gray-300 flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
            >
              ←
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 w-10 h-10 rounded-full shadow-xl border border-gray-300 flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
            >
              →
            </button>

            {/* Carousel */}
            <div className="relative overflow-hidden rounded-2xl">
              <div
                ref={carouselRef}
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  touchAction: 'pan-y',
                }}
              >
                {industriesData.map((industry) => (
                  <div
                    key={industry.id}
                    className="w-full flex-shrink-0"
                    style={{ padding: '0 8px' }}
                  >
                    <CreativeCard industry={industry} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {industriesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-blue-600 scale-125 shadow-lg'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="text-center mt-4 text-gray-600 text-sm font-medium">
              {currentIndex + 1} / {industriesData.length}
            </div>
          </div>
        )}
      </div>
       </div>
    </>
);
};

export default Industries;
