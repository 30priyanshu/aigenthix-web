import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import iot from '../IMAGES/Services Page images/Services-particular-pages-image/IoT.webp';
import Navbar from '../Navbar';
import SEO from '../SEO';

const IoTService = () => {
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
                title="Internet of Things (IoT) Solutions"
                description="Connect devices, data, and intelligence at scale. We build secure, real-time IoT ecosystems that enable smarter operations, automation, and predictive insights."
                url="/services/iot"
                image="/iot-og.jpg"
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
                            Internet of Things (IoT) Solutions
                        </motion.h1>

                        <motion.p
                            className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed text-gray-700"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            Connect devices, data, and intelligence at scale.
                            We build secure, real-time IoT ecosystems that enable
                            smarter operations, automation, and predictive insights.
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
                        Our IoT Capabilities
                    </motion.h2>

                    <motion.p
                        className="text-gray-600 max-w-2xl mx-auto mb-12"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        From device firmware to cloud platforms, we deliver
                        end-to-end IoT solutions designed for reliability,
                        scalability, and real-world impact.
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                        {[
                            { title: 'IoT Application Development', desc: 'Custom IoT apps for monitoring and control.' },
                            { title: 'Industrial IoT (IIoT)', desc: 'Smart factories and connected industrial systems.' },
                            { title: 'Embedded & Firmware', desc: 'Low-level device programming and optimization.' },
                            { title: 'Smart Devices', desc: 'Connected consumer and enterprise devices.' },
                            { title: 'Sensors & Gateways', desc: 'Reliable data capture and transmission.' },
                            { title: 'Cloud & Edge IoT', desc: 'Real-time processing using cloud and edge computing.' },
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
                            src={iot}
                            alt="IoT Architecture"
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
                            End-to-End IoT Architecture
                        </h3>
                        <p className="text-gray-600 mb-6">
                            We design complete IoT architectures covering devices,
                            connectivity, data pipelines, analytics, and dashboards —
                            ensuring security, scalability, and performance.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {[
                                'Device Management',
                                'Edge Computing',
                                'Real-Time Analytics',
                                'IoT Security'
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
                        Ready to Build Smart IoT Solutions?
                    </motion.h2>

                    <motion.p
                        className="max-w-2xl mx-auto mb-8 text-gray-200"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        Let’s connect your devices, data, and systems
                        into a powerful IoT ecosystem.
                    </motion.p>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
                        <Link
                            to="/contact"
                            className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Talk to Our IoT Experts
                        </Link>
                    </motion.div>
                </section>
            </div>
        </>
    );
};

export default IoTService;
