import React from 'react';
import { Link } from 'react-router-dom';
// Image imports remain the same
import healthcareImg from '../IMAGES/healthcare.jpeg';
import financialImg from '../IMAGES/financial.jpeg';
import retailImg from '../IMAGES/retail &ecommerce.jpeg';
import manufacturingImg from '../IMAGES/manifacturing intelligence.jpeg';
import educationImg from '../IMAGES/education.jpeg';
import enterpriseImg from '../IMAGES/enterprise.jpeg';

// The data structure remains the same
const industriesData = [
    {
        id: 1,
        title: 'Healthcare',
        slug: 'healthcare',
        description: 'Developing intelligent diagnostics, predictive patient care systems, and streamlined clinical workflows to transform health outcomes.',
        icon: '⚕️',
        image: healthcareImg,
    },
    {
        id: 2,
        title: 'Finance',
        slug: 'finance',
        description: 'Implementing fraud detection, personalized wealth management, and automated risk assessment for robust financial operations.',
        icon: '💰',
        image: financialImg,
    },
    {
        id: 3,
        title: 'Retail & E-commerce',
        slug: 'retail-ecommerce',
        description: 'Building hyper-personalized recommendation engines, dynamic pricing tools, and supply chain optimization systems.',
        icon: '🛒',
        image: retailImg,
    },
    {
        id: 4,
        title: 'Manufacturing Intelligence',
        slug: 'manufacturing-intelligence',
        description: 'Applying AI for predictive maintenance, quality control automation, and efficiency gains across the entire production line.',
        icon: '⚙️',
        image: manufacturingImg,
    },
    {
        id: 5,
        title: 'Education Technology',
        slug: 'education-technology',
        description: 'Creating adaptive learning platforms, automated grading systems, and personalized tutoring solutions for students.',
        icon: '🎓',
        image: educationImg,
    },
    {
        id: 6,
        title: 'Enterprise Solutions',
        slug: 'enterprise-solutions',
        description: 'Crafting custom AI agents and automation tools for HR, legal, and operational processes to drive enterprise-wide efficiency.',
        icon: '🏢',
        image: enterpriseImg,
    }
];

// Custom class for text shadow to ensure contrast on clearer images
// NOTE: You must define this custom utility in your global CSS or Tailwind config:
// @layer utilities { .text-shadow { text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9); } }
const TEXT_SHADOW_CLASS = 'text-shadow'; 


// --- Card Component with Clearer Images and Professional Visuals ---

const CreativeCard = ({ industry }) => (
    <div
        key={industry.id}
        className="group relative h-[400px] rounded-2xl overflow-hidden shadow-2xl 
                   transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-blue-500/70 
                   bg-blue-900/30"
    >
        {/* Background Image: Increased opacity (opacity-50) for a clearer visual */}
        <img
            src={industry.image}
            alt={`${industry.title} industry solution`}
            className="absolute inset-0 w-full h-full object-cover **opacity-50** transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dynamic Dark Gradient Overlay: Opacity reduced to 70% (from 90%) */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent **opacity-70** transition-opacity duration-500"></div>

        {/* Content Area */}
        <div className="relative p-8 h-full flex flex-col justify-end text-white">
            
            {/* Top Icon Area: Unique floating circle */}
            <div className="absolute top-8 left-8 w-14 h-14 flex items-center justify-center 
                            bg-blue-600 rounded-full shadow-2xl transition-all duration-500 
                            group-hover:bg-white group-hover:text-blue-700">
                <div className="text-3xl">{industry.icon}</div>
            </div>

            {/* Title: Added text-shadow for crisp visibility against the brighter background */}
            <h3 className={`text-3xl font-extrabold mb-3 leading-snug text-white transition-colors duration-300 ${TEXT_SHADOW_CLASS}`}>
                {industry.title}
            </h3>
            
            {/* Description (Slides up and fades in on hover) */}
            <p className={`text-sm text-blue-200 mb-6 max-h-0 opacity-0 
                          transition-all duration-500 ease-in-out 
                          group-hover:max-h-24 group-hover:opacity-100 ${TEXT_SHADOW_CLASS}`}>
                {industry.description}
            </p>

            {/* 'Explore Solution' Link */}
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
    return (
        <div className="min-h-screen bg-white font-['Poppins',_sans-serif] py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            </div>
        </div>
    );
};

export default Industries;