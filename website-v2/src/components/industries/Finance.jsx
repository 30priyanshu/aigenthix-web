import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import finance from "../IMAGES/Industries-particular-pages-image/finance.webp";
import Navbar from '../Navbar';
import SEO from '../SEO';

const Finance = () => {

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <SEO
        title="Financial Technology Solutions"
        description="Innovative, secure, and scalable fintech solutions that transform financial services and empower digital banking, payments, and wealth management."
        url="/finance"
        image="/finance-og.jpg"
      />
      <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
        <Navbar />

        {/* HERO */}
        <section className="relative py-20 lg:py-32 text-center about-hero">
          <div className="hero-overlay" />
          <div className="relative max-w-7xl mx-auto px-6">
            <motion.h1 className="text-5xl lg:text-7xl font-black mb-6" variants={fadeUp} initial="hidden" whileInView="visible">
              Intelligent Financial Technology Solutions
            </motion.h1>
            <motion.p className="text-xl lg:text-2xl italic max-w-4xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible">
              Secure, compliant, and AI-powered platforms for modern banking, fintech, and financial enterprises.
            </motion.p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-20 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4">Finance & FinTech Capabilities</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            We help banks, fintech startups, and enterprises modernize financial operations using AI, blockchain,
            and data-driven automation while maintaining regulatory compliance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {[
              { title: 'Fraud Detection', desc: 'AI models that detect suspicious transactions in real-time.' },
              { title: 'Digital Banking', desc: 'End-to-end digital banking and neobank platforms.' },
              { title: 'Risk Management', desc: 'Automated credit scoring and risk assessment.' },
              { title: 'Blockchain Payments', desc: 'Secure, fast, and transparent payment systems.' },
              { title: 'Financial Analytics', desc: 'Actionable insights for revenue, cost, and growth.' },
              { title: 'RegTech', desc: 'Compliance automation for global financial regulations.' }
            ].map((f, i) => (
              <div key={i} className="bg-[#f8f9ff] p-8 rounded-xl border shadow-sm">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STRATEGY */}
        <section className="flex flex-wrap items-center max-w-6xl mx-auto py-20 px-10 gap-10">
          <motion.img
            src={finance}
            className="flex-1 rounded-xl shadow-lg"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          />
          <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
            <h3 className="text-2xl font-bold mb-4">Secure & Scalable Financial Systems</h3>
            <p className="text-gray-600">
              Our finance solutions are designed to handle high transaction volumes, strict compliance requirements,
              and evolving customer expectations while maintaining security and performance.
            </p>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="bg-[#2D4DE8] text-white text-center py-16">
          <h2 className="text-3xl font-bold mb-4">Reimagine Finance with AI</h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-200">
            Build future-ready financial platforms trusted by millions of users.
          </p>
          <Link to="/contact" className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold">
            Get Started
          </Link>
        </section>
      </div>
    </>
  );
};

export default Finance;
