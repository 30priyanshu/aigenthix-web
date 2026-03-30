import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import enterprise from "../IMAGES/Industries-particular-pages-image/enterprise.webp";
import Navbar from '../Navbar';
import SEO from '../SEO';

const Enterprise = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <SEO
        title="Enterprise Digital Transformation"
        description="Scalable, secure, and intelligent enterprise solutions designed to optimize operations, accelerate growth, and enable data-driven decision making."
        url="/enterprise"
        image="/enterprise-og.jpg"
      />
      <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
        <Navbar />

        {/* HERO */}
        <section className="relative py-20 lg:py-32 text-center about-hero">
          <div className="hero-overlay" />
          <div className="relative max-w-7xl mx-auto px-6">
            <motion.h1 className="text-5xl lg:text-7xl font-black mb-6" variants={fadeUp} initial="hidden" whileInView="visible">
              Enterprise Digital Transformation
            </motion.h1>
            <motion.p className="text-xl lg:text-2xl italic max-w-4xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible">
              Scalable, secure, and intelligent enterprise solutions designed to optimize operations,
              accelerate growth, and enable data-driven decision making.
            </motion.p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-20 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4">Enterprise Capabilities</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            We help enterprises modernize legacy systems, streamline workflows, and unlock
            new efficiencies using AI, cloud, and automation technologies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {[
              { title: 'Business Automation', desc: 'AI-driven automation to eliminate manual operations.' },
              { title: 'Business Intelligence', desc: 'Advanced dashboards and real-time analytics.' },
              { title: 'Cloud Migration', desc: 'Secure and scalable cloud transformation strategies.' },
              { title: 'Enterprise Security', desc: 'Cybersecurity frameworks and data protection.' },
              { title: 'ERP & CRM', desc: 'Integrated enterprise platforms for operations & sales.' },
              { title: 'Data Warehousing', desc: 'Centralized, reliable enterprise data infrastructure.' }
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
            src={enterprise}
            className="flex-1 rounded-xl shadow-lg"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          />
          <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
            <h3 className="text-2xl font-bold mb-4">Enterprise-Grade Architecture</h3>
            <p className="text-gray-600 mb-4">
              Our solutions are built for high availability, performance, and security.
              We ensure seamless integration with existing systems while future-proofing
              your technology stack.
            </p>
            <p className="text-gray-600">
              From Fortune-level enterprises to fast-growing organizations, we deliver
              technology that scales with your business.
            </p>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="bg-[#2D4DE8] text-white text-center py-16">
          <h2 className="text-3xl font-bold mb-4">Power Your Enterprise Growth</h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-200">
            Transform enterprise operations with intelligent, secure, and scalable solutions.
          </p>
          <Link to="/contact" className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold">
            Speak With Experts
          </Link>
        </section>
      </div>
    </>
  );
};

export default Enterprise;
