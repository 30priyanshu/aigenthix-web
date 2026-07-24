import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DataEngineering from "../IMAGES/Services Page images/Services-particular-pages-image/DataEngineering.webp";
import DataEngineeringBusiness from "../IMAGES/Services Page images/Services-particular-pages-image/DataEngineeringBusiness.webp";
import Navbar from '../Navbar';
import SEO from '../SEO';

const DataEngineeringService = () => {
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
                title="Data Engineering Services "
                description="Build scalable, reliable, and high-performance data platforms. We transform raw data into trusted insights that drive AI, automation, and business growth."
                url="/services/data-engineering"
                image="/data-engineering-og.jpg"

            />
            <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
                <Navbar />

                {/* HERO SECTION */}
                <section className="relative py-20 lg:py-32 about-hero">
                    <div className="hero-overlay" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1
                            className="text-5xl lg:text-7xl font-black mb-6 tracking-tight"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            Data Engineering That Powers Intelligent Decisions
                        </motion.h1>

                        <motion.p
                            className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            Build scalable, reliable, and high-performance data platforms.
                            We transform raw data into trusted insights that drive AI,
                            automation, and business growth.
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
                        Our Data Engineering Capabilities
                    </motion.h2>

                    <motion.p
                        className="text-gray-600 max-w-2xl mx-auto mb-12"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        We design and implement modern data architectures
                        that enable analytics, AI, and real-time intelligence.
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                        {[
                            { title: 'Data Pipelines', desc: 'Scalable batch and streaming pipelines.' },
                            { title: 'Real-Time Processing', desc: 'Event-driven and streaming architectures.' },
                            { title: 'Data Warehousing', desc: 'Cloud-native warehouses and lakehouses.' },
                            { title: 'ETL & ELT', desc: 'Reliable data transformations.' },
                            { title: 'Analytics Ready', desc: 'Optimized datasets for BI and AI.' },
                            { title: 'Cloud Data Platforms', desc: 'AWS, Azure & GCP data stacks.' },
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
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {f.desc}
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
                            src={DataEngineeringBusiness}
                            alt="Data Engineering Architecture"
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
                            End-to-End Data Engineering
                        </h3>
                        <p className="text-gray-600 mb-6">
                            From ingestion and transformation to analytics
                            and AI readiness, we manage the full data lifecycle
                            with security, governance, and scalability.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {[
                                'Data Lakes',
                                'Lakehouse Architecture',
                                'Data Governance',
                                'Cloud Migration'
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
                            Data Solutions Across Industries
                        </h3>
                        <p className="text-gray-600 mb-6">
                            We empower organizations with data-driven insights
                            across finance, healthcare, retail, and manufacturing.
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
                            src={DataEngineering}
                            alt="Business Analytics"
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
                        Ready to Build a Future-Proof Data Platform?
                    </motion.h2>

                    <motion.p
                        className="max-w-2xl mx-auto mb-8 text-gray-200"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        Let our data experts help you unlock the full
                        value of your data ecosystem.
                    </motion.p>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
                        <Link
                            to="/contact"
                            className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Talk to Our Data Experts
                        </Link>
                    </motion.div>
                </section>
            </div>
        </>
    );
};

export default DataEngineeringService;
