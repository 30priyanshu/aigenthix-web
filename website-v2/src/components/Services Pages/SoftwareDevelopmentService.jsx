import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import softwaredevelopment from '../IMAGES/Services Page images/Services-particular-pages-image/SoftwareDevelopment.webp';
import Navbar from '../Navbar';
import SEO from '../SEO';

const SoftwareDevelopmentService = () => {
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
                title="Software Development Services"
                description="Learn about AiGenthix — our mission, vision, AI research, ethical approach, and how we help businesses grow using cutting-edge artificial intelligence."
                url="/services/software-development"
                image="/software-development-og.jpg"
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
                            Custom Software Development
                        </motion.h1>

                        <motion.p
                            className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed text-gray-700"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            Scalable, secure, and future-ready software solutions.
                            We design and build custom applications that accelerate
                            innovation, efficiency, and digital transformation.
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
                        Our Software Capabilities
                    </motion.h2>

                    <motion.p
                        className="text-gray-600 max-w-2xl mx-auto mb-12"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        We build high-performance software tailored to your business
                        goals, from idea to deployment and beyond.
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                        {[
                            { title: 'Custom Software', desc: 'Tailored solutions built for your unique business needs.' },
                            { title: 'SaaS Development', desc: 'Scalable, cloud-native SaaS platforms.' },
                            { title: 'UI/UX Design', desc: 'Intuitive, user-centric digital experiences.' },
                            { title: 'Web Applications', desc: 'Secure and high-performance web systems.' },
                            { title: 'Mobile Apps', desc: 'Cross-platform mobile solutions.' },
                            { title: 'System Integration', desc: 'Seamless integration with existing systems.' },
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

                {/* DEVELOPMENT APPROACH */}
                <section className="flex flex-wrap items-center justify-between max-w-6xl mx-auto py-20 px-10 gap-10">
                    <motion.div
                        className="flex-1 min-w-[320px]"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        <img
                            src={softwaredevelopment}
                            alt="Software Strategy"
                            className="w-full h-[350px] object-cover rounded-xl shadow-lg"
                        />
                    </motion.div>

                    <motion.div
                        className="flex-1"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        <h3 className="text-2xl font-bold mb-4">
                            End-to-End Software Development
                        </h3>
                        <p className="text-gray-600 mb-6">
                            From planning and architecture to development, testing,
                            deployment, and maintenance — we manage the full
                            software lifecycle with precision and scalability.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {[
                                'Product Engineering',
                                'Agile Development',
                                'Cloud Deployment',
                                'DevOps'
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

                {/* CTA */}
                <section className="bg-[#2D4DE8] text-white text-center py-16 px-6">
                    <motion.h2
                        className="text-3xl font-bold mb-4"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        Ready to Build Custom Software?
                    </motion.h2>

                    <motion.p
                        className="max-w-2xl mx-auto mb-8 text-gray-200"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        Let’s build powerful software solutions that scale
                        with your business and drive long-term success.
                    </motion.p>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
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

export default SoftwareDevelopmentService;
