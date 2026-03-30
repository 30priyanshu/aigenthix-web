import React from 'react';

// Importing the local images paths provided by the user
import work1Image from '../IMAGES/work1.png';
import work2Image from '../IMAGES/work2.png';
import work3Image from '../IMAGES/work3.png';
// --- NEW IMAGE IMPORTED ---
import work4Image from '../IMAGES/tradingai.jpg'; 

// --- KEYFRAMES/ANIMATION STYLES ---

const fadeInSlide = `
  @keyframes fadeInSlide {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Dynamically insert keyframes
try {
    const styleSheet = document.styleSheets[0];
    const rules = Array.from(styleSheet.cssRules).map(rule => rule.cssText);
    if (!rules.some(rule => rule.includes('@keyframes fadeInSlide'))) {
        styleSheet.insertRule(fadeInSlide, styleSheet.cssRules.length);
    }
} catch (e) {
    console.warn("Could not insert CSS keyframes. Animations might not work.", e);
}


// Placeholder project data - 4th Card Updated with new image
const workData = [
    {
        title: "AI-Powered Customer Service Agent",
        description: "Developed Sahyak AI to handle 80% of routine customer inquiries, reducing response time by 65%.",
        image: work1Image,
        tags: ["AI Agent", "SaaS", "FinTech"],
        link: "#",
    },
    {
        title: "Intelligent Supply Chain Optimization",
        description: "Implemented a predictive model for a large retailer to forecast inventory needs and reduce logistics costs by 15%.",
        image: work2Image,
        tags: ["Machine Learning", "Logistics", "Optimization"],
        link: "#",
    },
    {
        title: "Ethical Candidate Screening Tool",
        description: "Created an AI interviewer platform ensuring unbiased candidate assessment and compliance with fair hiring practices.",
        image: work3Image,
        tags: ["HR Tech", "NLP", "Ethical AI"],
        link: "#",
    },
    // --- UPDATED 4TH CARD: Using imported tradingai.jpg ---
    {
        title: "Algorithmic Trading Strategy Generator",
        description: "Built a sophisticated ML-based system that analyzes real-time market data to generate and test high-frequency trading strategies, yielding a 10% alpha.",
        image: work4Image, // <-- **THIS IS THE NEW IMAGE**
        tags: ["FinTech", "MLOps", "Big Data"],
        link: "#",
    },
];

const Work = () => {
    return (
        <section className="bg-white py-20 px-4">
            <div className="max-w-7xl mx-auto">
                
                {/* Heading (Animated) */}
                <h2 
                    className="text-4xl sm:text-5xl font-serif font-bold text-gray-800 mb-4 text-center tracking-tight"
                    style={{ opacity: 0, animation: 'fadeInSlide 0.8s ease-out 0s forwards' }}
                >
                    Our Impactful Work
                </h2>
                <p 
                    className="text-lg text-gray-600 mb-16 text-center max-w-3xl mx-auto"
                    style={{ opacity: 0, animation: 'fadeInSlide 0.8s ease-out 0.2s forwards' }}
                >
                    Explore our recent case studies where cutting-edge AI meets real-world business challenges, delivering measurable results.
                </p>

                {/* Projects Grid - Now designed to fit 2x2 layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {workData.map((project, index) => (
                        <a 
                            key={index}
                            href={project.link}
                            // Elegant Card Styling & Staggered Animation
                            className="group bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 
                                       transition duration-500 transform hover:scale-[1.02] hover:shadow-2xl flex flex-col md:flex-row"
                            style={{ 
                                opacity: 0, 
                                animation: `fadeInSlide 0.8s ease-out ${0.4 + index * 0.2}s forwards` 
                            }}
                        >
                            {/* Left: Image Area */}
                            <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                                <img 
                                    src={project.image} 
                                    alt={project.title} 
                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Right: Content Area */}
                            <div className="md:w-1/2 p-6 flex flex-col justify-between">
                                <div>
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {project.tags.map((tag, tagIndex) => (
                                            <span 
                                                key={tagIndex} 
                                                className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition duration-300">
                                        {project.title}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className="text-base text-gray-600 leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>
                                
                                {/* Call to action Link */}
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <span className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center">
                                        View Case Study
                                        <svg className="ml-1 w-4 h-4 transition duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
                
                {/* Optional: Central Button for More Work (Animated) */}
                <div className="text-center mt-16" style={{ opacity: 0, animation: 'fadeInSlide 0.8s ease-out 1.2s forwards' }}>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-md text-base transition duration-300 shadow-lg hover:scale-[1.03] transform">
                        See All Projects
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Work;