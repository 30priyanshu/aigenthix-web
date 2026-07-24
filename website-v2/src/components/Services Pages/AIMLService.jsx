import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AIMLStrategy from '../IMAGES/Services Page images/Services-particular-pages-image/AIMLStrategy.webp';
import AIMLAcrossIndustries from '../IMAGES/Services Page images/Services-particular-pages-image/AIMLAcrossIndustries.webp';
import Navbar from '../Navbar';
import SEO from '../SEO';

const AIMLService = () => {
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };

    return (
        <>
            <SEO
                title="AI & ML Services"
                description="Build intelligent systems that learn, adapt, and scale. We help businesses unlock the power of AI & ML to automate, predict, and innovate with confidence."
                url="/services/ai-ml"
                image="/ai-ml-og.jpg"
            />
            <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
                <Navbar />

                {/* HERO SECTION */}
                <section className="relative py-20 lg:py-32 about-hero">
                    <div className="hero-overlay" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1
                            className="text-5xl lg:text-7xl font-black mb-6"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            Artificial Intelligence & Machine Learning
                        </motion.h1>

                        <motion.p
                            className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            Build intelligent systems that learn, adapt, and scale.
                            We help businesses unlock the power of AI & ML to automate,
                            predict, and innovate with confidence.
                        </motion.p>
                    </div>
                </section>

                {/* FEATURES */}
                <section className="py-20 bg-white text-center">
                    <motion.h2
                        className="text-3xl font-bold text-gray-900 mb-4"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        Our AI & ML Capabilities
                    </motion.h2>

                    <motion.p
                        className="text-gray-600 max-w-2xl mx-auto mb-12"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        We design, train, and deploy production-grade AI models
                        that solve real-world business challenges across industries.
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                        {[
                            { title: 'AI Model Development', desc: 'Custom AI models built for performance and scalability.' },
                            { title: 'Machine Learning', desc: 'Supervised and unsupervised ML solutions for insights.' },
                            { title: 'Computer Vision', desc: 'Image and video intelligence using deep learning.' },
                            { title: 'Deep Learning', desc: 'Neural networks for complex pattern recognition.' },
                            { title: 'NLP', desc: 'Text analytics, chatbots, and language understanding.' },
                            { title: 'AI Automation', desc: 'AI-powered workflows to improve efficiency.' },
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                className="bg-[#f8f9ff] p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <div className="text-4xl mb-4">{f.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* STRATEGY SECTION */}
                <section className="flex flex-wrap items-center justify-between max-w-6xl mx-auto py-20 px-10 gap-10">
                    <motion.div
                        className="flex-1 min-w-[320px]"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        <img
                            src={AIMLStrategy}
                            alt="AI Strategy"
                            className="w-full h-[300px] object-cover rounded-xl shadow-lg"
                        />
                    </motion.div>

                    <motion.div
                        className="flex-1"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        <h3 className="text-2xl font-bold mb-4">
                            End-to-End AI & ML Development
                        </h3>
                        <p className="text-gray-600 mb-6">
                            From data preparation and feature engineering to
                            model training, deployment, and monitoring —
                            we manage the complete AI lifecycle with enterprise-grade security.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {[
                                'Data Engineering',
                                'Model Training',
                                'MLOps',
                                'AI Integration'
                            ].map((t, i) => (
                                <span
                                    key={i}
                                    className="bg-[#e9edff] text-[#2D4DE8] px-4 py-2 rounded-full text-sm font-medium"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* INDUSTRIES */}
                <section className="flex flex-wrap items-center justify-between max-w-6xl mx-auto py-20 px-10 gap-10">
                    <motion.div
                        className="flex-1"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        <h3 className="text-2xl font-bold mb-4">
                            AI Solutions Across Industries
                        </h3>
                        <p className="text-gray-600 mb-6">
                            We help organizations leverage AI for smarter decisions,
                            predictive insights, and intelligent automation across domains.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {[
                                'Banking & Finance',
                                'Healthcare',
                                'Retail',
                                'Manufacturing'
                            ].map((t, i) => (
                                <span
                                    key={i}
                                    className="bg-[#e9edff] text-[#2D4DE8] px-4 py-2 rounded-full text-sm font-medium"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-1 min-w-[320px]"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        <img
                            src={AIMLAcrossIndustries}
                            alt="AI Industry Use Cases"
                            className="w-full h-[300px] object-cover rounded-xl shadow-lg"
                        />
                    </motion.div>
                </section>

                {/* CTA */}
                <section className="bg-[#2D4DE8] text-white text-center py-16 px-6">
                    <motion.h2
                        className="text-3xl font-bold mb-4"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        Ready to Build Intelligent AI Systems?
                    </motion.h2>

                    <motion.p
                        className="max-w-2xl mx-auto mb-8 text-gray-200"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        Partner with us to design AI & ML solutions
                        that deliver real, measurable business impact.
                    </motion.p>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
                        <Link
                            to="/contact"
                            className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Talk to Our AI Experts
                        </Link>
                    </motion.div>
                </section>
            </div>
        </>
    );
};

export default AIMLService;
