import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HumanoidRobotics from "../IMAGES/Services Page images/Services-particular-pages-image/HumanoidRobotics.webp";
import HumanoidSystemsBusiness from "../IMAGES/Services Page images/Services-particular-pages-image/HumanoidSystemsBusiness.webp";
import Navbar from "../Navbar";
import SEO from "../SEO";

const HumanoidSystems = () => {
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
      title: "Human-Robot Interaction(HRI)",
      desc: "Seamless communication between humans and intelligent robotic systems.",
     },
    {
      title: "Computer Vision & Perception",
      desc: "Robots that perceive, analyze, and respond to real-world environments.",
      },
    {
      title: "AI Cognitive Engine",
      desc: "Advanced AI models powering decision-making and autonomous behavior.",
       },
  ];

  return (
    <>
      <SEO
        title="Humanoid Systems & Robotics Services"
        description="Build next-generation humanoid systems with advanced AI, robotics engineering, and real-world adaptability for modern industries."
        url="/services/humanoid-systems"
        image="/humanoid-systems-og.jpg"
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
              Humanoid Systems Shaping the Future
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              We design and develop intelligent humanoid systems powered by AI,
              enabling real-world automation, human interaction, and adaptive
              decision-making.
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
            Our Humanoid Systems Expertise
          </motion.h2>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            We combine AI, robotics, and intelligent systems engineering to build
            scalable humanoid solutions for modern enterprises.
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
              src={HumanoidRobotics}
              alt="Humanoid Robotics"
              className="w-full h-[250px] object-cover rounded-xl shadow-lg"
            />
          </motion.div>

          <motion.div
            className="flex-1"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <h3 className="text-2xl font-bold mb-4">
              End-to-End Humanoid System Development
            </h3>
            <p className="text-gray-600 mb-6">
              From hardware design to AI deployment, we deliver complete humanoid
              solutions optimized for real-world performance and scalability.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                "Motion Control Systems",
                "AI Decision Engines",
                "Real-time Perception",
                "Autonomous Navigation",
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
              Humanoids Across Industries
            </h3>
            <p className="text-gray-600 mb-6">
              Humanoid systems are enabling intelligent automation across
              multiple industries, improving efficiency, productivity, and
              human-machine collaboration.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                "Industrial Automation",
                "Retail & Customer Experience",
                "Smart Infrastructure",
                "Logistics & Warehousing",
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
              src={HumanoidSystemsBusiness}
              alt="Humanoid AI Growth"
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
            Ready to Build the Future with Humanoids?
          </motion.h2>

          <motion.p
            className="max-w-2xl mx-auto mb-8 text-gray-200"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            Partner with us to design intelligent humanoid systems that transform
            operations, enhance automation, and redefine human-machine interaction.
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

export default HumanoidSystems;