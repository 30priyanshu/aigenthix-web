import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import RoboticsEngineering from "../IMAGES/Services Page images/Services-particular-pages-image/RoboticsEngineering.webp";
import Navbar from "../Navbar";
import SEO from "../SEO";

const RoboticsService = () => {
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
      title: "Industrial Robotics",
      desc: "Automation robots for factories and production lines.",
    },
    {
      title: "Robotic Process Automation",
      desc: "Smart automation for repetitive business tasks.",
    },
    {
      title: "Autonomous Robotics",
      desc: "Self-navigating robots for logistics and mobility.",
    },
    {
      title: "Healthcare Robotics",
      desc: "Robots supporting medical and patient care.",
    },
    {
      title: "Warehouse Robotics",
      desc: "Automation for smart supply chain operations.",
    },
    {
      title: "Robotics Engineering & Integration",
      desc: "Complete robotics system development.",
    },
  ];

  return (
    <>
      <SEO
        title="Robotics Solutions for Smart Automation Services"
        description="Transform industries with intelligent robotics systems. From automation to autonomous machines, we engineer the future of robotics."
        url="/services/robotics"
        image="/robotics-og.jpg"
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
            >
              Robotics Solutions for Smart Automation
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
            >
              Transform industries with intelligent robotics systems.
              From automation to autonomous machines, we engineer the future of robotics.
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
            Our Robotics Expertise
          </motion.h2>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            We build intelligent robotics systems that improve productivity,
            automation, and operational excellence.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {features.map((f, i) => (
              <motion.div
                layout
                key={i}
                onClick={() => setActive(active === i ? null : i)}
                className="cursor-pointer bg-[#f8f9ff] p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>

                <AnimatePresence>
                  {active === i && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="mt-4 text-sm text-gray-700"
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
          <motion.div className="flex-1 min-w-[320px]" variants={fadeUp} initial="hidden" whileInView="visible">
            <img
              src={RoboticsEngineering}
              alt="Robotics Development"
              className="w-full h-[250px] object-cover rounded-xl shadow-lg"
            />
          </motion.div>

          <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
            <h3 className="text-2xl font-bold mb-4">
              End-to-End Robotics Engineering
            </h3>
            <p className="text-gray-600 mb-6">
              From robotics design and AI integration to deployment and maintenance,
              we deliver complete automation systems.
            </p>

            <div className="flex flex-wrap gap-3">
              {["Robot Design", "Autonomous Navigation", "AI Robotics", "Industrial Automation"].map((t, i) => (
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
          <motion.h2 className="text-3xl font-bold mb-4" variants={fadeUp} initial="hidden" whileInView="visible">
            Ready to Innovate with Robotics?
          </motion.h2>

          <motion.p className="max-w-2xl mx-auto mb-8 text-gray-200" variants={fadeUp} initial="hidden" whileInView="visible">
            Let our robotics experts build intelligent automation systems that drive business growth.
          </motion.p>

          <Link
            to="/contact"
            className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Speak to Our Experts
          </Link>
        </section>
      </div>
    </>
  );
};

export default RoboticsService;
