import React, { useState, useEffect, useRef } from "react";

/* ======================================================
   Animated Stat Component
====================================================== */
const AnimatedStat = ({ stat }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCount();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statRef.current) observer.observe(statRef.current);

    return () => {
      if (statRef.current) observer.unobserve(statRef.current);
    };
  }, [hasAnimated]);

  const animateCount = () => {
    const duration = 2000;
    const steps = 60;
    const increment = stat.number / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;

      if (current >= stat.number) {
        setCount(stat.number);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
  };

  return (
    <div ref={statRef} className="text-center group">
      <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#2D4DE8] mb-3 group-hover:scale-110 transition-transform duration-300">
        {count}
        {stat.suffix}
      </h3>
      <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
        {stat.label}
      </p>
    </div>
  );
};

/* ======================================================
   TrustedBy Component
====================================================== */
const TrustedBy = () => {
  const stats = [
    { number: 100, label: "AI Experts", suffix: "+" },
    { number: 160, label: "Software Products Delivered", suffix: "+" },
    { number: 50, label: "AI Solutions", suffix: "+" },
    { number: 15, label: "Total Years of Experience", suffix: "+" },
  ];

  /* ✅ Logos with Image Links */
  const logos = [
    {
      name: "Times Group",
      img: "https://www.time4education.com/theme/times/time/images/logov2.png",
    },
    {
      name: "BeamWelly",
      img: "https://beamwelly.com/wp-content/uploads/2023/11/beam_welly_logo-removebg-preview.png",
    },
    {
      name: "SVPCET",
      img: "https://almashines.s3.dualstack.ap-southeast-1.amazonaws.com/assets/images/institutes/logo/170x170/1519.jpg?v=1702015468",
    },
    {
      name: "Maharashtra Govt",
      img: "https://e7.pngegg.com/pngimages/921/740/png-clipart-black-text-with-logo-illustration-mumbai-government-of-india-government-of-maharashtra-logo-government-miscellaneous-emblem.png",
    },
  ];

  return (
    <section className="bg-[#F5F5F5] py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* Heading */}
        <h2
          className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-14"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Trusted By Leading Enterprises
        </h2>

        {/* ======================================================
            LOGO INFINITE SCROLL
        ====================================================== */}
        <div className="relative overflow-hidden mb-16">
          <div className="flex whitespace-nowrap animate-scroll">
            {/* First Set */}
            {logos.map((logo, index) => (
              <div
                key={`logo-first-${index}`}
                className="flex-shrink-0 w-36 sm:w-48 md:w-56 h-20 mx-6 sm:mx-10 flex justify-center items-center"
              >
                <img
                  src={logo.img}
                  alt={logo.name}
                  className="h-14 sm:h-16 object-contain hover:scale-110 transition duration-300"
                />
              </div>
            ))}

            {/* Duplicate Set */}
            {logos.map((logo, index) => (
              <div
                key={`logo-second-${index}`}
                className="flex-shrink-0 w-36 sm:w-48 md:w-56 h-20 mx-6 sm:mx-10 flex justify-center items-center"
              >
                <img
                  src={logo.img}
                  alt={logo.name}
                  className="h-14 sm:h-16 object-contain hover:scale-110 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="w-1/3 mx-auto h-[1px] bg-gray-300 my-10"></div>

        {/* ======================================================
            STATS SECTION
        ====================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-14 mt-14">
          {stats.map((stat, index) => (
            <AnimatedStat key={index} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
