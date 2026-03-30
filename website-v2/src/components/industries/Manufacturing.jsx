import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import manufacturing from "../IMAGES/Industries-particular-pages-image/manufacturing.webp";
import Navbar from '../Navbar';
import SEO from '../SEO';

const Manufacturing = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <SEO
        title="Smart Manufacturing Solution"
        description="Driving efficiency, automation, and intelligence across modern manufacturing ecosystems."
        url="/manufacturing"
        image="/manufacturing-og.jpg"
      />
      <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
        <Navbar />

        <section className="relative py-20 lg:py-32 text-center about-hero">
          <div className="hero-overlay" />
          <div className="relative max-w-7xl mx-auto px-6">
            <motion.h1 className="text-5xl lg:text-7xl font-black mb-6" variants={fadeUp} initial="hidden" whileInView="visible">
              Smart Manufacturing Solutions
            </motion.h1>
            <motion.p className="text-xl lg:text-2xl italic max-w-4xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible">
              Driving efficiency, automation, and intelligence across modern manufacturing ecosystems.
            </motion.p>
          </div>
        </section>

        <section className="py-20 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4">Manufacturing Capabilities</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            Our manufacturing solutions combine AI, IoT, and data analytics to optimize
            production, reduce downtime, and enhance operational visibility.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {[
              { title: 'Smart Factory', desc: 'Digitally connected and automated manufacturing plants.' },
              { title: 'Predictive Maintenance', desc: 'AI-based failure prediction & reduced downtime.' },
              { title: 'Industrial IoT', desc: 'Real-time equipment monitoring and insights.' },
              { title: 'Supply Chain Optimization', desc: 'Data-driven logistics and inventory management.' },
              { title: 'Robotics Integration', desc: 'Intelligent automation for production lines.' },
              { title: 'Quality Control', desc: 'AI-powered inspection and defect detection.' }
            ].map((f, i) => (
              <div key={i} className="bg-[#f8f9ff] p-8 rounded-xl border shadow-sm">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center max-w-6xl mx-auto py-20 px-10 gap-10">
          <motion.img
            src={manufacturing}
            alt="Manufacturing Illustration"
            className="flex-1 w-full h-[320px] object-cover rounded-xl shadow-lg"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          />
          <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
            <h3 className="text-2xl font-bold mb-4">Industry 4.0 Ready</h3>
            <p className="text-gray-600 mb-4">
              We help manufacturers adopt Industry 4.0 practices by integrating smart technologies
              across production and operations.
            </p>
            <p className="text-gray-600">
              The result is increased productivity, reduced costs, and greater operational resilience.
            </p>
          </motion.div>
        </section>

        <section className="bg-[#2D4DE8] text-white text-center py-16">
          <h2 className="text-3xl font-bold mb-4">Build Smarter Factories</h2>
          <Link to="/contact" className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold">
            Start Transformation
          </Link>
        </section>
      </div>
    </>
  );
};

export default Manufacturing;
