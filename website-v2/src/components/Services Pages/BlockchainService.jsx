import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import blockchain from "../IMAGES/Services Page images/Services-particular-pages-image/blockchainservice.webp";
import blockchainacrossindustries from "../IMAGES/Services Page images/Services-particular-pages-image/Blockchain Across Industries.webp";
import Navbar from "../Navbar";
import SEO from "../SEO";

const BlockchainService = () => {
  const [active, setActive] = useState(null);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const features = [
    {
      title: "Blockchain Development",
      desc: "Custom blockchain solutions for modern enterprises.",
      detail:
        "We design and develop scalable blockchain platforms that enable secure, transparent, and decentralized digital ecosystems for businesses.",
    },
    {
      title: "Smart Contracts",
      desc: "Automated agreements powered by blockchain.",
      detail:
        "Our smart contract solutions help automate transactions, reduce manual processing, and ensure trustless execution across industries.",
    },
    {
      title: "Crypto & Digital Assets",
      desc: "Tokenization and digital asset innovation.",
      detail:
        "We build token-based ecosystems including cryptocurrencies, NFTs, and digital asset platforms that unlock new business opportunities.",
    },
    {
      title: "Blockchain for Banking & Finance",
      desc: "Secure financial systems with decentralized trust.",
      detail:
        "Our blockchain solutions enable faster payments, fraud prevention, decentralized finance (DeFi), and next-gen banking security.",
    },
    {
      title: "Supply Chain Blockchain",
      desc: "Track products with transparency and trust.",
      detail:
        "We develop blockchain-based supply chain systems that provide real-time traceability, authenticity, and fraud reduction.",
    },
    {
      title: "Enterprise Blockchain Security",
      desc: "Secure blockchain deployments at scale.",
      detail:
        "We ensure blockchain solutions are production-ready with strong cryptographic security, compliance frameworks, and enterprise-grade scalability.",
    },
  ];

  return (
    <>
      <SEO
        title="Blockchain Technology for the Future Services"
        description="Unlock secure, transparent, and decentralized innovation with blockchain technology. From smart contracts to enterprise solutions, we help businesses lead the digital revolution."
        url="/services/blockchain"
        image="/blockchain-og.jpg"
      />
      <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
        <Navbar />

        {/* HERO */}
        <section className="relative py-20 lg:py-32 about-hero">
          <div className="hero-overlay" />
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <motion.h1
              className="text-5xl lg:text-7xl font-black mb-6"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Blockchain Technology for the Future
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Unlock secure, transparent, and decentralized innovation with
              blockchain technology. From smart contracts to enterprise solutions,
              we help businesses lead the digital revolution.
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
            Our Blockchain Expertise
          </motion.h2>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            We deliver blockchain-powered solutions that enable trust, automation,
            and security across industries.
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
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
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
          <motion.div
            className="flex-1 min-w-[320px]"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <img
              src={blockchain}
              alt="Blockchain Strategy"
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
              End-to-End Blockchain Development
            </h3>
            <p className="text-gray-600 mb-6">
              We cover the complete blockchain lifecycle — from architecture design
              and smart contract development to deployment, scaling, and security.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                "Smart Contracts",
                "Decentralized Apps (DApps)",
                "Tokenization",
                "Enterprise Blockchain",
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

        {/* BUSINESS */}
        <section className="flex flex-wrap items-center justify-between max-w-6xl mx-auto py-20 px-10 gap-10">
          <motion.div
            className="flex-1"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <h3 className="text-2xl font-bold mb-4">
              Blockchain Across Industries
            </h3>
            <p className="text-gray-600 mb-6">
              Blockchain is transforming industries like finance, healthcare,
              logistics, and government with secure and transparent systems.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                "Banking & Finance",
                "Supply Chain Management",
                "Healthcare Records",
                "Digital Governance",
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
              src={blockchainacrossindustries}
              alt="Blockchain Growth"
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
            Ready to Transform with Blockchain?
          </motion.h2>

          <motion.p
            className="max-w-2xl mx-auto mb-8 text-gray-200"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            Let our blockchain experts help you design decentralized systems that
            drive trust, transparency, and innovation.
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

export default BlockchainService;
