import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import blockchain from '../IMAGES/Services Page images/Services-particular-pages-image/Blockchain.webp';
import blockchain2 from '../IMAGES/Services Page images/Services-particular-pages-image/Blockchain2.webp';
import Navbar from '../Navbar';
import SEO from '../SEO';



const Web3Service = () => {
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };

    return (
        <>
            <SEO
                title="Web3 Development Services"
                description="Empowering the future with secure, scalable, and innovative Web3 solutions. From decentralized apps to smart contracts, we build the digital backbone of the new internet."
                url="/services/web3-development"
                image="/web3-development-og.jpg"
            />

            <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
                <Navbar />

                {/* HERO SECTION - full width like reference image 2 */}
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
                            Empowering the Future with Web3 Innovation
                        </motion.h1>
                        <motion.p
                            className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            Unlock decentralized possibilities with secure, scalable, and efficient blockchain solutions. From smart contracts to NFTs, we build the digital backbone of the new internet.
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
                        Our Web3 Expertise
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 max-w-2xl mx-auto mb-12"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        We deliver custom Web3 products that combine innovation and reliability, built with blockchain-native technologies.
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                        {[
                            { title: 'Decentralized Apps', desc: 'Transparent and secure dApps that redefine user ownership.' },
                            { title: 'Smart Contracts', desc: 'Audited and optimized contracts built on Solidity & Rust.' },
                            { title: 'NFT Platforms', desc: 'Seamless NFT minting, trading, and integration solutions.' },
                            { title: 'Tokenomics', desc: 'Designing and launching custom ERC, BEP, and Solana tokens.' },
                            { title: 'DAO Systems', desc: 'Community-driven decentralized governance made simple.' },
                            { title: 'AI + Web3', desc: 'Leverage decentralized AI for smarter blockchain ecosystems.' },
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
                        <img src={blockchain} alt="Web3 Strategy" className="w-full rounded-xl shadow-lg" />
                    </motion.div>

                    <motion.div
                        className="flex-1"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        <h3 className="text-2xl font-bold mb-4">Streamlined Blockchain Development</h3>
                        <p className="text-gray-600 mb-6">
                            Our agile Web3 strategies accelerate development cycles while maintaining security and transparency.
                            From token creation to DeFi app integration — we handle it all with precision.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {['Smart Contract Audits', 'Gas Optimization', 'Cross-chain Support', 'Decentralized Storage'].map((t, i) => (
                                <span key={i} className="bg-[#e9edff] text-[#2D4DE8] px-4 py-2 rounded-full text-sm font-medium">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* BUSINESS GROWTH */}
                <section className="flex flex-wrap items-center justify-between max-w-6xl mx-auto py-20 px-10 gap-10">
                    <motion.div
                        className="flex-1"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        <h3 className="text-2xl font-bold mb-4">Empowering Businesses with Blockchain Insights</h3>
                        <p className="text-gray-600 mb-6">
                            We empower organizations to make smarter, verifiable decisions through decentralized ledgers.
                            Blockchain’s transparency builds trust and enhances efficiency across operations.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {['DeFi Solutions', 'NFT Marketplaces', 'DAO Governance', 'Private Blockchains'].map((t, i) => (
                                <span key={i} className="bg-[#e9edff] text-[#2D4DE8] px-4 py-2 rounded-full text-sm font-medium">
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
                        <img src={blockchain2} alt="Blockchain Growth" className="w-full rounded-xl shadow-lg" />
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
                        Ready to Build Your Web3 Vision?
                    </motion.h2>
                    <motion.p
                        className="max-w-2xl mx-auto mb-8 text-gray-200"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                    >
                        Partner with us to create secure, scalable, and future-ready blockchain products that stand out.
                    </motion.p>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
                        <Link
                            to="/contact"
                            className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Let’s Collaborate
                        </Link>
                    </motion.div>
                </section>
            </div>
        </>
    );
};

export default Web3Service;
