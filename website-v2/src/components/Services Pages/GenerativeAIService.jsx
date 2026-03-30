import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EndtoEndGenAI from '../IMAGES/Services Page images/Services-particular-pages-image/EndtoEndGenAI.webp';
import GenerativeAIAcrossIndustries from '../IMAGES/Services Page images/Services-particular-pages-image/GenerativeAIAcrossIndustries.webp';
import Navbar from '../Navbar';
import SEO from '../SEO';

const GenerativeAIService = () => {
    const [active, setActive] = useState(null);

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };

    const features = [
        {
            title: 'Custom AI Chatbots',
            desc: 'Advanced conversational agents powered by LLMs.',
        },
        {
            title: 'Content Generation',
            desc: 'Automated text, reports, and marketing content.',
        },
        {
            title: 'Image Generation',
            desc: 'Creative AI using diffusion-based models.',
        },
        {
            title: 'Voice AI',
            desc: 'Speech synthesis and voice-enabled assistants.',
        },
        {
            title: 'AI Agents',
            desc: 'Autonomous AI agents for task execution.',
        },
        {
            title: 'Enterprise GenAI',
            desc: 'Secure and scalable AI deployments.',
        },
    ];

    return (
        <>
            <SEO
                title="Generative AI Solutions for Your Business Services"
                description="Unlock the next level of innovation with generative AI. From intelligent content creation to workflow automation, we help businesses stay ahead with AI-driven solutions."
                url="/services/generative-ai"
                image="/generative-ai-og.jpg"
            />
            <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
                <Navbar />

                {/* HERO */}
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
                            Generative AI Solutions for Your Business
                        </motion.h1>
                        <motion.p
                            className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            Unlock the next level of innovation with generative AI.
                            From intelligent content creation to workflow automation,
                            we help businesses stay ahead with AI-driven solutions.
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
                        Our Generative AI Expertise
                    </motion.h2>

                    <motion.p
                        className="text-gray-600 max-w-2xl mx-auto mb-12"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        We design and deploy production-ready generative AI systems
                        that enhance creativity, productivity, and decision-making.
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                        {features.map((f, i) => (
                            <motion.div
                                layout
                                key={i}
                                onClick={() => setActive(active === i ? null : i)}
                                className="cursor-pointer bg-[#f8f9ff] p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <div className="text-4xl mb-4">{f.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>

                                <AnimatePresence>
                                    {active === i && (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                            className="mt-4 text-sm text-gray-700 leading-relaxed"
                                        >
                                            {f.detail}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* STRATEGY */}
                <section className="flex flex-wrap items-center justify-between max-w-6xl mx-auto py-20 px-10 gap-10">
                    <motion.div className="flex-1 min-w-[320px]" variants={fadeUp} initial="hidden" whileInView="visible">
                        <img
                            src={EndtoEndGenAI}
                            alt="Generative AI Strategy"
                            className="w-full h-[300px] object-cover rounded-xl shadow-lg"
                        />
                    </motion.div>

                    <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
                        <h3 className="text-2xl font-bold mb-4">End-to-End Generative AI Development</h3>
                        <p className="text-gray-600 mb-6">
                            We cover the complete AI lifecycle — from use-case discovery and model selection to fine-tuning, deployment, and monitoring.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {['LLM Fine-Tuning', 'Prompt Engineering', 'RAG Systems', 'AI Integration'].map((t, i) => (
                                <span key={i} className="bg-[#e9edff] text-[#2D4DE8] px-4 py-2 rounded-full text-sm font-medium">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* BUSINESS */}
                <section className="flex flex-wrap items-center justify-between max-w-6xl mx-auto py-20 px-10 gap-10">
                    <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
                        <h3 className="text-2xl font-bold mb-4">Generative AI Across Industries</h3>
                        <p className="text-gray-600 mb-6">
                            Our AI solutions empower industries like banking, retail, healthcare, and manufacturing with intelligent automation.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {['Banking & Finance', 'Retail & E-commerce', 'Healthcare', 'Manufacturing'].map((t, i) => (
                                <span key={i} className="bg-[#e9edff] text-[#2D4DE8] px-4 py-2 rounded-full text-sm font-medium">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div className="flex-1 min-w-[320px]" variants={fadeUp} initial="hidden" whileInView="visible">
                        <img
                            src={GenerativeAIAcrossIndustries}
                            alt="AI Business Growth"
                            className="w-full h-[300px] object-cover rounded-xl shadow-lg"
                        />
                    </motion.div>
                </section>

                {/* CTA */}
                <section className="bg-[#2D4DE8] text-white text-center py-16 px-6">
                    <motion.h2 className="text-3xl font-bold mb-4" variants={fadeUp} initial="hidden" whileInView="visible">
                        Ready to Transform with Generative AI?
                    </motion.h2>

                    <motion.p className="max-w-2xl mx-auto mb-8 text-gray-200" variants={fadeUp} initial="hidden" whileInView="visible">
                        Let our AI experts help you design intelligent systems that create real business impact.
                    </motion.p>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
                        <Link
                            to="/contact"
                            className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Speak to Our Experts
                        </Link>
                    </motion.div>
                </section>
            </div>
        </>
    );
};

export default GenerativeAIService;
