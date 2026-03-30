import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CyberSecurity from "../IMAGES/Services Page images/Services-particular-pages-image/CyberSecurity.webp";
import CyberSecurityBusiness from "../IMAGES/Services Page images/Services-particular-pages-image/CyberSecurityBusiness.webp";
import Navbar from "../Navbar";
import SEO from "../SEO";

const CybersecurityService = () => {
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
      title: "Threat Detection & Prevention",
      desc: "Proactive monitoring against cyber threats.",
    },
    {
      title: "Data Protection & Encryption",
      desc: "Secure sensitive information with advanced encryption.",
    },
    {
      title: "Network Security",
      desc: "Defense against intrusions and unauthorized access.",
    },
    {
      title: "Cyber Risk Assessment",
      desc: "Identify vulnerabilities before attackers do.",
    },
    {
      title: "AI-Powered Cybersecurity",
      desc: "Smart security automation using artificial intelligence.",
    },
    {
      title: "Enterprise Security & Compliance",
      desc: "Secure infrastructure aligned with global standards.",
    },
  ];

  return (
    <>
      <SEO
        title="Cybersecurity Services"
        description="Protect your business with advanced cybersecurity systems. From threat detection to enterprise compliance, we secure your digital future."
        url="/services/cybersecurity"
        image="/cybersecurity-og.jpg"
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
              Cybersecurity Solutions for the Digital Era
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Protect your business with advanced cybersecurity systems.
              From threat detection to enterprise compliance, we secure your
              digital future.
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
            Our Cybersecurity Expertise
          </motion.h2>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            We provide next-generation cybersecurity services that safeguard
            businesses from evolving digital threats.
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
              src={CyberSecurity}
              alt="Cybersecurity Strategy"
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
              End-to-End Cybersecurity Protection
            </h3>
            <p className="text-gray-600 mb-6">
              We cover the full cybersecurity lifecycle — from security strategy
              and risk assessment to implementation, monitoring, and response.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                "Threat Intelligence",
                "Penetration Testing",
                "Zero Trust Security",
                "Incident Response",
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
              Cybersecurity Across Industries
            </h3>
            <p className="text-gray-600 mb-6">
              Our cybersecurity solutions empower industries like banking,
              healthcare, retail, and government with secure digital ecosystems.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                "Banking & Finance",
                "Healthcare Security",
                "E-commerce Protection",
                "Government Systems",
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
              src={CyberSecurityBusiness}
              alt="Cybersecurity Growth"
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
            Ready to Secure Your Business?
          </motion.h2>

          <motion.p
            className="max-w-2xl mx-auto mb-8 text-gray-200"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            Let our cybersecurity experts help you build strong protection against
            evolving digital threats.
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

export default CybersecurityService;
