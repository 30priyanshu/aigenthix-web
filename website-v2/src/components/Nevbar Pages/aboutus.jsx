import React from 'react';
import { Link } from 'react-router-dom';
import SEO from "../SEO";
import { breadcrumbSchema } from "../../lib/seo.schemas";

const AboutUs = () => {
    // Company milestones
    const milestones = [
        { year: '2020', title: 'Founded', description: 'AiGenthix established with vision to democratize AI' },
        { year: '2021', title: 'First Major Client', description: 'Partnered with Fortune 500 company for AI transformation' },
        { year: '2022', title: 'Research Breakthrough', description: 'Published groundbreaking research in ethical AI' },
        { year: '2023', title: 'Global Expansion', description: 'Expanded operations to 3 continents' },
        { year: '2024', title: 'Industry Leader', description: 'Recognized as top AI consulting firm' }
    ];

    // Core values
    const values = [
        {
            icon: '🔬',
            title: 'Innovation',
            description: 'Pushing boundaries in AI research and development'
        },
        {
            icon: '⚖️',
            title: 'Ethics First',
            description: 'Building responsible and transparent AI systems'
        },
        {
            icon: '🤝',
            title: 'Partnership',
            description: 'Working collaboratively to achieve client success'
        },
        {
            icon: '🌍',
            title: 'Impact',
            description: 'Creating meaningful change across industries'
        }
    ];

   return (
    <>
        <SEO
            title="About AiGENThix - Our Mission, Vision & Ethical AI Approach"
            description="Learn about AiGENThix — an AI consulting company founded in 2020, specializing in ethical AI, machine learning, and enterprise solutions across 3 continents."
            keywords="about AiGENThix, AI company, ethical AI, AI consulting firm, machine learning company, AI research, enterprise AI solutions"
            structuredData={breadcrumbSchema([{ name: 'About', path: '/about' }])}
        />

        <div className="min-h-screen bg-white text-black font-['Poppins',_sans-serif]">
            
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 about-hero">
                <div className="hero-overlay"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl lg:text-7xl font-black mb-6">
                        About AiGenthix
                    </h1>
                    <p className="text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
                        Pioneering the future of artificial intelligence through innovative consulting, 
                        cutting-edge research, and transformative training solutions.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8 text-black">Our Mission & Vision</h2>
                            <div className="space-y-8">
                                <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-blue-600">
                                    <h3 className="text-2xl font-bold text-blue-600 mb-3">Our Mission</h3>
                                    <p className="text-gray-700 text-lg">
                                        To democratize artificial intelligence by providing accessible, ethical, 
                                        and transformative AI solutions that empower businesses and enhance 
                                        human capabilities across all industries.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-blue-700">
                                    <h3 className="text-2xl font-bold text-blue-700 mb-3">Our Vision</h3>
                                    <p className="text-gray-700 text-lg">
                                        A world where AI seamlessly integrates with human intelligence to solve 
                                        complex challenges, drive innovation, and create sustainable growth 
                                        while maintaining the highest ethical standards.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 transform rotate-3">
                                <div className="bg-white rounded-xl p-8 transform -rotate-3 border border-gray-200">
                                    <h3 className="text-3xl font-bold text-black mb-6">What We Do</h3>
                                    <p className="text-gray-700 text-lg mb-6">
                                        <strong>AiGenthix</strong> is an AI consulting and solutions company specializing in 
                                        cutting-edge artificial intelligence applications across multiple industries.
                                    </p>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                            AI Consulting & Strategy Development
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                                            AI Training & Workforce Upskilling
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-700 rounded-full mr-3"></span>
                                            AI Research & Development
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                            Custom AI Solution Development
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-4 text-black">Our Core Values</h2>
                    <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                        The principles that guide our work and define our culture
                    </p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div 
                                key={index}
                                className="bg-white p-8 rounded-2xl text-center border border-gray-200 hover:border-blue-600 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-lg"
                            >
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-black mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What Makes Us Different */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-4 text-black">
                        Why Choose AiGenthix?
                    </h2>
                    <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                        We stand out in the AI landscape through our unique approach and capabilities
                    </p>

                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🌱</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2">Ethical AI Approach</h3>
                                    <p className="text-gray-600">
                                        We prioritize fairness, transparency, and accountability in every AI solution we develop.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2">Industry-Specific Expertise</h3>
                                    <p className="text-gray-600">
                                        Tailored AI solutions designed to meet the unique challenges of each industry we serve.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🔧</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2">Comprehensive Services</h3>
                                    <p className="text-gray-600">
                                        End-to-end AI solutions including consulting, training, and R&D under one roof.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🌍</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2">Commitment to Social Impact</h3>
                                    <p className="text-gray-600">
                                        Building AI that enhances human well-being while driving business growth.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2">Cutting-Edge Research</h3>
                                    <p className="text-gray-600">
                                        Continuous innovation in NLP, computer vision, and predictive analytics.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🤝</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2">Partnership Model</h3>
                                    <p className="text-gray-600">
                                        We work as strategic partners, not just vendors, ensuring your long-term success.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Journey */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-4 text-black">Our Journey</h2>
                    <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                        Milestones in our mission to transform industries through AI
                    </p>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-300 h-full"></div>
                        
                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <div 
                                    key={index}
                                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                                        <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
                                            <div className="text-blue-600 font-bold text-lg mb-2">{milestone.year}</div>
                                            <h3 className="text-xl font-bold text-black mb-2">{milestone.title}</h3>
                                            <p className="text-gray-600">{milestone.description}</p>
                                        </div>
                                    </div>
                                    <div className="relative w-8 h-8 bg-blue-600 rounded-full border-4 border-white z-10"></div>
                                    <div className="w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-gray-100 to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-black mb-6">
                        Ready to Transform Your Business with AI?
                    </h2>
                    <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                        Join the ranks of industry leaders who trust AiGenthix for their AI transformation journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105 border border-blue-600"
                        >
                            Start Your AI Journey
                        </Link>
                        <Link
                            to="/services"
                            className="border-2 border-blue-600 text-blue-600 font-bold py-4 px-8 rounded-full hover:bg-blue-600 hover:text-white transition duration-300"
                        >
                            Explore Our Services
                        </Link>
                    </div>
                </div>
            </section>
            </div>
    </>
);
};

export default AboutUs;