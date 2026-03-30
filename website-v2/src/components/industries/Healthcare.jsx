import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import healthcare from "../IMAGES/Industries-particular-pages-image/healthcare.webp";
import Navbar from '../Navbar';
import SEO from '../SEO';

const Healthcare = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <SEO
        title="Intelligent Healthcare Solutions"
        description="Transforming healthcare with AI-powered, secure, and scalable solutions for patient care, medical research, and health data management."
        url="/healthcare"
        image="/healthcare-og.jpg"
      />
      <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
        <Navbar />

        {/* HERO */}
        <section className="relative py-20 lg:py-32 text-center about-hero">
          <div className="hero-overlay" />
          <div className="relative max-w-7xl mx-auto px-6">
            <motion.h1 className="text-5xl lg:text-7xl font-black mb-6" variants={fadeUp} initial="hidden" whileInView="visible">
              Intelligent Healthcare Solutions
            </motion.h1>
            <motion.p className="text-xl lg:text-2xl italic max-w-4xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible">
              Empowering hospitals, clinics, and health-tech platforms with AI-driven, secure, and scalable healthcare systems.
            </motion.p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-20 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4">Healthcare Capabilities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            End-to-end digital healthcare solutions built for compliance, performance, and patient-centric care.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {[
              { title: 'Clinical AI', desc: 'AI-assisted diagnostics, medical imaging & prediction systems.' },
              { title: 'Telemedicine', desc: 'Secure virtual consultations and remote monitoring platforms.' },
              { title: 'EHR Systems', desc: 'Interoperable electronic health records with analytics.' },
              { title: 'HIPAA Security', desc: 'Data privacy, encryption & healthcare-grade security.' },
              { title: 'Health Analytics', desc: 'Actionable insights from complex patient data.' },
              { title: 'AI Assistants', desc: 'Virtual healthcare assistants for staff & patients.' }
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
            src={healthcare}
            alt="Healthcare Illustration"
            className="flex-1 w-full h-[320px] object-cover rounded-xl shadow-lg"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          />
          <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
            <h3 className="text-2xl font-bold mb-4">Patient-Centric Digital Care</h3>
            <p className="text-gray-600">
              We integrate AI, cloud, and secure data pipelines to improve patient outcomes,
              reduce operational overhead, and enhance clinical efficiency.
            </p>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="bg-[#2D4DE8] text-white text-center py-16">
          <h2 className="text-3xl font-bold mb-4">Modernize Your Healthcare Platform</h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-200">
            Build future-ready healthcare systems with AI, security, and scalability at the core.
          </p>
          <Link to="/contact" className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold">
            Talk to Experts
          </Link>
        </section>
      </div>
    </>
  );
};

export default Healthcare;
