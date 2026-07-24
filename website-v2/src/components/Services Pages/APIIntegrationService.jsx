import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../IMAGES/Services Page images/Services-particular-pages-image/API.webp';
import Navbar from '../Navbar';
import SEO from '../SEO';

const APIIntegrationService = () => {
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    };

    return (
        <>
            <SEO
                title="API Integration Services"
                description="Seamlessly connect applications, platforms, and services with secure, scalable, and high-performance API integrations that power automation and digital growth."
                url="/services/api-integration"
                image="/api-integration-og.jpg"
            />
            <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
                <Navbar />

                {/* HERO SECTION */}
                <section className="relative py-20 lg:py-32 about-hero">
                    <div className="hero-overlay" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1
                            className="text-5xl lg:text-7xl font-black tracking-tight mb-6 text-gray-900"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            API Integration Services
                        </motion.h1>

                        <motion.p
                            className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed text-gray-700"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            Seamlessly connect applications, platforms, and services
                            with secure, scalable, and high-performance API integrations
                            that power automation and digital growth.
                        </motion.p>
                    </div>
                </section>

                {/* CAPABILITIES */}
                <section className="py-20 bg-white text-center">
                    <motion.h2
                        className="text-3xl font-bold text-gray-900 mb-4"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        Our API Integration Capabilities
                    </motion.h2>

                    <motion.p
                        className="text-gray-600 max-w-2xl mx-auto mb-12"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        We design reliable and secure API architectures that
                        enable seamless communication between systems.
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                        {[
                            {
                                title: 'REST & GraphQL APIs',
                                desc: 'High-performance APIs built for scalability and security.'
                            },
                            {
                                title: 'Secure API Architecture',
                                desc: 'Authentication, authorization, and rate limiting.'
                            },
                            {
                                title: 'Payment Integrations',
                                desc: 'Stripe, Razorpay, PayPal, and custom gateways.'
                            },
                            {
                                title: 'Cloud & SaaS APIs',
                                desc: 'AWS, Azure, Google Cloud, and SaaS platforms.'
                            },
                            {
                                title: 'CRM & ERP Integration',
                                desc: 'Salesforce, SAP, HubSpot, and enterprise tools.'
                            },
                            {
                                title: 'Third-Party Services',
                                desc: 'Connect external tools into unified workflows.'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="bg-[#f8f9ff] p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {item.desc}
                                </p>
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
                            src={api}
                            alt="API Strategy"
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
                            End-to-End API Integration
                        </h3>
                        <p className="text-gray-600 mb-6">
                            From system analysis and API design to implementation,
                            testing, and monitoring — we manage the full integration
                            lifecycle with enterprise-grade reliability.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {[
                                'API Design',
                                'Authentication',
                                'Monitoring',
                                'Scalable Architecture'
                            ].map((tag, i) => (
                                <span
                                    key={i}
                                    className="bg-[#e9edff] text-[#2D4DE8] px-4 py-2 rounded-full text-sm font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
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
                        Need Reliable API Integrations?
                    </motion.h2>

                    <motion.p
                        className="max-w-2xl mx-auto mb-8 text-gray-200"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        Let us help you build secure, scalable API solutions
                        that connect your systems effortlessly.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        <Link
                            to="/contact"
                            className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Talk to Our Experts
                        </Link>
                    </motion.div>
                </section>
            </div>
        </>
    );
};

export default APIIntegrationService;
