import React, { useRef } from 'react';
import { Link } from "react-router-dom";


// Import images
import enterpriseImg from '../IMAGES/Home Page images/Industries images/enterprise.webp';
import financialImg from '../IMAGES/Home Page images/Industries images/financial.webp';
import healthcareImg from '../IMAGES/Home Page images/Industries images/healthcare.webp';
import educationImg from '../IMAGES/Home Page images/Industries images/education.webp';
import retailImg from '../IMAGES/Home Page images/Industries images/retail &ecommerce.webp';
import manufacturingImg from '../IMAGES/Home Page images/Industries images/manifacturing intelligence.webp';

// Data for the product/solution cards
const servicesData = [
  {
    title: "Healthcare AI Solutions",
    slug: "healthcare",
    content: "Developing intelligent diagnostics, predictive patient care systems, and streamlined clinical workflows to transform health outcomes.",
    image: healthcareImg
  },
  {
    title: "Financial Services AI",
    slug: "finance",
    content: "Implementing fraud detection, personalized wealth management, and automated risk assessment for robust financial operations.",
    image: financialImg
  },
  {
    title: "Retail & E-commerce",
    slug: "retail-ecommerce",
    content: "Building hyper-personalized recommendation engines, dynamic pricing tools, and supply chain optimization systems.",
    image: retailImg
  },
  {
    title: "Manufacturing Intelligence",
    slug: "manufacturing",
    content: "Applying AI for predictive maintenance, quality control automation, and efficiency gains across the entire production line.",
    image: manufacturingImg
  },
  {
    title: "Education Technology",
    slug: "education",
    content: "Creating adaptive learning platforms, automated grading systems, and personalized tutoring solutions for students.",
    image: educationImg
  },
  {
    title: "Enterprise Solutions",
    slug: "enterprise-solutions",
    content: "Crafting custom AI agents and automation tools for HR, legal, and operational processes to drive enterprise-wide efficiency.",
    image: enterpriseImg
  }
];

const ServicesSection = () => {
  const scrollRef = useRef(null);

  return (
    <section className="bg-[#0B2847] py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-semibold text-white mb-16 text-center tracking-tight">
          Transforming Industries with Intelligent AI Solutions
        </h2>

        {/* Card Container (fully responsive) */}
        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible scroll-smooth snap-x snap-mandatory scrollbar-hide"
        >
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="bg-[#0D345B] min-w-[85%] sm:min-w-[60%] md:min-w-0 rounded-xl border border-[#1a4f8d] shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-[1.02] flex flex-col overflow-hidden group snap-center"
            >
              {/* Image Header */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D345B]"></div>
              </div>

              {/* Content Area */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed flex-grow mb-4">
                  {service.content}
                </p>
                <Link
  to={`/industries/${service.slug}`}
  className="mt-auto text-[#4285F4] hover:text-[#6DD5ED] 
             font-semibold text-sm transition duration-200 
             flex items-center group-hover:translate-x-1"
>
  Explore Solution
  <svg
    className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
</Link>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
