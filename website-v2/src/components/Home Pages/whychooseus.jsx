import React, { useRef, useState, useEffect } from "react";

// Data for the "Why Choose Us" cards
const featuresData = [
  {
    icon: (
      <svg
        className="w-16 h-16 text-blue-500 group-hover:text-white transition duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 12l2 2 4-4m5.618-4.275a1.125 1.125 0 011.238-3.076l.322.091c.877.247 1.25 1.144.821 1.902L20.47 6.168a.93.93 0 01-.191 1.054L15 12h-3v4l-4 4-1.636-1.636a2 2 0 01-.546-2.583L7 11.5V11a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v.5L13.061 9.53a.5.5 0 01.488-.135l.983.279a.5.5 0 01.278.487l-.023.23a.5.5 0 01-.487.439l-.983-.279zM12 21.5a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
        />
      </svg>
    ),
    title: "Ethical AI & Responsible Innovation",
    description:
      "We embed ethical considerations into every stage of development, ensuring fairness, transparency, and accountability in all our AI solutions.",
  },
  {
    icon: (
      <svg
        className="w-16 h-16 text-blue-500 group-hover:text-white transition duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Deep Technical Expertise",
    description:
      "Our team comprises seasoned AI engineers, data scientists, and domain experts committed to leveraging the latest advancements for your success.",
  },
  {
    icon: (
      <svg
        className="w-16 h-16 text-blue-500 group-hover:text-white transition duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9.75 3L11.75 5.5M11.75 5.5L13.75 3M11.75 5.5V17.5M6 19.5h12c1.1 0 2-.9 2-2s-.9-2-2-2H6c-1.1 0-2 .9-2 2s.9 2 2 2z"
        />
      </svg>
    ),
    title: "Agile & Collaborative Approach",
    description:
      "We partner closely with clients, fostering transparency and flexibility throughout the development lifecycle to meet evolving business needs.",
  },
];

const WhyChooseUs = () => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Use a constant for the gap between mobile cards (e.g., space-x-8 = 32px)
  const mobileGap = 32; 

  // 1. Check if mobile (screen width <= 768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 2. Scroll/Navigation logic
  const scroll = (directionOrIndex) => {
    const container = scrollRef.current;
    if (!container) return;

    // Get the actual width of a card element (including its left margin/padding in the flow)
    const firstCard = container.firstChild;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth; // width + padding + border (flex-none width)
    const scrollAmount = cardWidth + mobileGap;
    
    let nextIndex;

    if (typeof directionOrIndex === 'number') {
      nextIndex = directionOrIndex;
    } else {
      if (directionOrIndex === 'right') {
        nextIndex = (currentIndex + 1) % featuresData.length;
      } else {
        nextIndex = currentIndex === 0 ? featuresData.length - 1 : currentIndex - 1;
      }
    }
    
    setCurrentIndex(nextIndex);
    const targetScrollLeft = nextIndex * scrollAmount;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
  };

  // 3. Effect to update currentIndex based on actual scroll position (e.g., native swipe)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isMobile) return;

    const handleScroll = () => {
      const firstCard = container.firstChild;
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      const scrollAmount = cardWidth + mobileGap;
      
      // Calculate the nearest index based on current scroll position
      const newIndex = Math.round(container.scrollLeft / scrollAmount);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < featuresData.length) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, currentIndex]);


  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gray-800 mb-16 text-center tracking-tight">
          Why Partner with <span className="text-blue-600">AiGENThix?</span>
        </h2>

        {/* Cards Wrapper (Desktop grid, Mobile carousel) */}
        <div className="relative">
          
          {/* Navigation Arrows (Mobile Only) */}
          {isMobile && (
            <>
              {/* Left Arrow */}
              <button
                aria-label="scroll-left"
                onClick={() => scroll('left')}
                className="absolute z-10 left-0 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-600 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                aria-label="scroll-right"
                onClick={() => scroll('right')}
                className="absolute z-10 right-0 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-600 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Cards Container - Conditional Rendering/Classes */}
          <div
            ref={scrollRef}
            // Desktop Layout (md and up): Grid layout
            className={`
              ${!isMobile ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-10' : ''}
              
              ${isMobile ? 
                // Mobile Layout: Horizontal flex with full-width cards, overflow, and snapping
                'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-8 px-10' 
                : 
                // Mobile needs horizontal margin to offset the parent's padding (px-4 = 16px) for edge-to-edge feel
                'mx-auto'
              }
            `}
            // Only apply negative margin on mobile to compensate for section's padding (px-4 = 16px)
            // and the 'px-10' (40px) added for inner centering/padding
            style={isMobile ? { marginLeft: '-16px', marginRight: '-16px' } : {}} 
          >
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className={`
                  bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl 
                  transition duration-300 transform hover:-translate-y-2 text-center 
                  group flex flex-col items-center justify-center
                  
                  ${isMobile ? 'flex-none w-full snap-center' : ''}
                `}
                // Mobile style: Set card width to 100% of the scrolling container minus the gap (space-x-8 = 32px)
                style={isMobile ? { minWidth: `calc(100% - ${mobileGap}px)` } : {}}
              >
                {/* Icon */}
                <div className="mb-6 bg-blue-50 p-5 rounded-full flex items-center justify-center transition duration-300 group-hover:bg-blue-600">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 leading-tight group-hover:text-blue-600 transition duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-base leading-relaxed group-hover:text-gray-700 transition duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Dot Indicators (Mobile Only) */}
          {isMobile && (
            <div className="flex justify-center mt-8 space-x-3">
              {featuresData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scroll(index)} 
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;