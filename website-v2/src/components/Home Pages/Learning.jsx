import React from 'react';
import { Link } from 'react-router-dom';

// Image imports
import vrHeadsetImg from '../IMAGES/aitraining.jpg'; 
import globalNetworkImg from '../IMAGES/corporate.jpg'; 

const TEXT_SHADOW_CLASS = 'drop-shadow-lg';

// Icon components
const BookOpenIcon = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.433 9.351 5 7.8 5c-2.021 0-4.101.378-5.9 1.115L2 6v14m6-2.5v-10h.5m4.5 10v-10m0 10v-10h.5m5-2.5c2.021 0 4.101.378 5.9 1.115L22 6v14m-2.2-2.5c-1.8-0.737-3.879-1.115-5.9-1.115s-4.1.378-5.9 1.115M12 16.5V10"/>
    </svg>
);
const UsersIcon = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-5v-2a3 3 0 00-3-3H6a3 3 0 00-3 3v2H1M6 10a4 4 0 100-8 4 4 0 000 8zm8 2.5a4 4 0 100-8 4 4 0 000 8z"/>
    </svg>
);
const AwardIcon = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
    </svg>
);

// L&D Offerings Data
const offerings = [
    {
        id: 1,
        title: 'TGP Certified Programs',
        description: 'Comprehensive, project-based certifications designed to validate deep expertise in AI, Machine Learning, and advanced data science technologies.',
        focus: 'Individual Skill Mastery',
        icon: AwardIcon,
        color: 'text-white',
    },
    {
        id: 2,
        title: 'Corporate Training Workshops',
        description: 'Tailored, on-site sessions for corporate teams to bridge skill gaps and integrate AI/ML workflows into existing business processes and digital transformation efforts.',
        focus: 'Enterprise Skill Advancement',
        icon: UsersIcon,
        color: 'text-white',
    },
    {
        id: 3,
        title: 'Academic Guest Lectures',
        description: 'Engaging lectures and seminars in schools and colleges (clgs) to inspire the next generation of technologists and provide real-world insights into the AI industry.',
        focus: 'Future Talent Nurturing',
        icon: BookOpenIcon,
        color: 'text-white',
    },
];

// --- Main Component: Learning.jsx ---

const Learning = () => {
    return (
        <div className="min-h-screen bg-white font-['Poppins',_sans-serif] py-24 text-black relative overflow-hidden">
            
            {/* Hero Section - Eye-catching text colors */}
            <div 
                className="relative text-center mb-20 pt-16 pb-24 bg-cover bg-center rounded-3xl mx-4 lg:mx-8"
                style={{ backgroundImage: `url(${vrHeadsetImg})` }} 
            >
                {/* Dark overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* H1: Eye-catching with gradient and white text */}
                    <h1 className={`text-6xl md:text-7xl font-black mb-6 tracking-tight ${TEXT_SHADOW_CLASS}`}>
                        <span className="text-cyan-300 italic">AI-DRIVEN</span> 
                        <span className="text-white"> Learning & </span>
                        <span className="text-cyan-300 italic">CORPORATE</span>
                        <span className="text-white"> </span>
                        <span className="text-cyan-400 italic">TRAINING</span>
                    </h1>
                    
                    {/* P: Eye-catching bright white text */}
                    <p className={`text-xl font-semibold text-white max-w-4xl mx-auto leading-relaxed mt-6 ${TEXT_SHADOW_CLASS}`}>
                        <span className="text-cyan-200">🚀 AIgenthix L&D</span> offers industry-leading <span className="text-yellow-300 font-bold">TGP Certifications</span>, immersive <span className="text-yellow-300 font-bold">corporate sessions</span>, and impactful <span className="text-yellow-300 font-bold">guest lectures</span> to close the tech skill gap.
                    </p>
                    
                    <Link
                        to="/contact"
                        className="mt-12 inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-12 rounded-lg shadow-2xl transition duration-500 transform hover:scale-105 relative overflow-hidden group border-2 border-cyan-300 text-lg"
                    >
                        <span className="relative z-10">REQUEST A WORKSHOP</span>
                    </Link>
                </div>
            </div>

            {/* Offerings Section - Eye-catching colors */}
            <div 
                className="relative mt-20 py-24 bg-cover bg-center rounded-3xl mx-4 lg:mx-8"
                style={{ backgroundImage: `url(${globalNetworkImg})` }} 
            >
                {/* Dark overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className={`text-6xl md:text-7xl font-black text-center mb-4 ${TEXT_SHADOW_CLASS}`}>
                        <span className="text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">Our Specialized </span>
                        <span className="text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.8)]">L&D</span>
                        <span className="text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]"> Ecosystem</span>
                    </h2>
                    <p className={`text-center text-white text-2xl font-bold mb-16 max-w-3xl mx-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]`}>
                        <span className="text-cyan-200">Transforming careers and organizations </span>
                        <span className="text-yellow-300">through cutting-edge</span>
                        <span className="text-cyan-200"> AI education</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {offerings.map((item, index) => (
                            <div 
                                key={item.id}
                                className={`p-8 rounded-2xl shadow-2xl transition-all duration-700 
                                            transform hover:-translate-y-4 border-2 border-cyan-400 hover:border-yellow-300
                                            bg-gradient-to-br from-blue-900/80 to-blue-800/80 backdrop-blur-md group relative overflow-hidden hover:shadow-2xl`}
                            >
                                <div className={`absolute -top-1/2 -left-1/2 w-full h-full rounded-full transition-transform duration-700 ease-in-out blur-3xl opacity-0 group-hover:opacity-20 bg-cyan-400`}></div>

                                <div className={`w-16 h-16 flex items-center justify-center rounded-full 
                                                 bg-gradient-to-br from-cyan-400 to-blue-400 backdrop-blur-sm text-white mb-6 border-2 border-cyan-300
                                                 transition-all duration-500 transform group-hover:scale-120 group-hover:rotate-12 shadow-lg`}>
                                    <item.icon className="w-8 h-8"/>
                                </div>

                                <h3 className={`text-2xl font-black mb-3 text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]`}>
                                    {item.title}
                                </h3>
                                
                                <p className={`text-gray-100 mb-6 leading-relaxed ${TEXT_SHADOW_CLASS}`}>
                                    {item.description}
                                </p>

                                <div className="inline-block px-5 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-black transition duration-300 group-hover:from-yellow-300 group-hover:to-yellow-200 shadow-lg drop-shadow-[0_0_10px_rgba(253,224,71,0.6)]">
                                    ⭐ {item.focus}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer CTA Section - Eye-catching colors */}
                <div className={`mt-24 text-center p-12 bg-gradient-to-r from-blue-900/95 to-blue-800/95 rounded-2xl border-2 border-cyan-400 max-w-4xl mx-auto backdrop-blur-md shadow-2xl ${TEXT_SHADOW_CLASS}`}>
                    <h3 className="text-4xl font-black mb-4 text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
                        🎯 Ready to Upskill Your Team?
                    </h3>
                    <p className="text-xl font-bold text-white mb-8 max-w-3xl mx-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        Connect with our L&D specialists today to design a custom program that meets your organization's specific technical objectives.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-14 rounded-full transition duration-300 hover:from-cyan-400 hover:to-blue-400 transform hover:translate-y-[-2px] shadow-2xl text-lg border-2 border-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                    >
                        📅 Schedule a Consultation
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Learning;