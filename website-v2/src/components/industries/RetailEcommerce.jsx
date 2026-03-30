import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import retail from "../IMAGES/Industries-particular-pages-image/retail.webp";
import Navbar from '../Navbar';
import SEO from '../SEO';

const RetailEcommerce = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <SEO
        title="Retail & E-commerce Solutions"
        description="AI-driven, scalable, and secure retail and e-commerce solutions that enhance customer experiences, optimize operations, and drive digital transformation."
        url="/retail-ecommerce"
        image="/retail-og.jpg"
      />
      <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
        <Navbar />

        <section className="relative py-20 lg:py-32 text-center about-hero">
          <div className="hero-overlay" />
          <div className="relative max-w-7xl mx-auto px-6">
            <motion.h1 className="text-5xl lg:text-7xl font-black mb-6" variants={fadeUp} initial="hidden" whileInView="visible">
              Retail & E-commerce Innovation
            </motion.h1>
            <motion.p className="text-xl lg:text-2xl italic max-w-4xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible">
              Data-driven, personalized, and scalable retail platforms for the modern digital economy.
            </motion.p>
          </div>
        </section>

        <section className="py-20 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4">Retail Capabilities</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            We enable retailers and e-commerce brands to enhance customer experience,
            optimize inventory, and drive revenue growth using AI and analytics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {[
              { title: 'Personalized Shopping', desc: 'AI-based product recommendations.' },
              { title: 'Inventory Forecasting', desc: 'Demand prediction & stock optimization.' },
              { title: 'Customer Analytics', desc: 'Insights into behavior & preferences.' },
              { title: 'Omni-channel Commerce', desc: 'Unified online and offline experiences.' },
              { title: 'Payment Integration', desc: 'Secure and scalable payment systems.' },
              { title: 'Growth Optimization', desc: 'Conversion rate & performance optimization.' }
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
            src={retail}
            alt="retail illustration"
            className="flex-1 w-full h-[320px] object-cover rounded-xl shadow-lg"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          />
          <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
            <h3 className="text-2xl font-bold mb-4">Customer-First Commerce</h3>
            <p className="text-gray-600 mb-4">
              Our retail platforms focus on personalization, performance, and scalability,
              ensuring seamless customer journeys across devices.
            </p>
            <p className="text-gray-600">
              From startups to enterprise retailers, we build systems that convert traffic into loyalty.
            </p>
          </motion.div>
        </section>

        <section className="bg-[#2D4DE8] text-white text-center py-16">
          <h2 className="text-3xl font-bold mb-4">Scale Your Retail Business</h2>
          <Link to="/contact" className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold">
            Let’s Build
          </Link>
        </section>
      </div>
    </>
  );
};

export default RetailEcommerce;
