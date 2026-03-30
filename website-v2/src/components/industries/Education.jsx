import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import education from "../IMAGES/Industries-particular-pages-image/education.webp";
import Navbar from '../Navbar';
import SEO from '../SEO';

const Education = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <SEO
        title="Smart Education Technology Solutions"
        description="Transforming learning experiences through AI-powered, scalable, and interactive education platforms."
        url="/education"
        image="/education-og.jpg"
      />
      <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800">
        <Navbar />

        <section className="relative py-20 lg:py-32 text-center about-hero">
          <div className="hero-overlay" />
          <div className="relative max-w-7xl mx-auto px-6">
            <motion.h1 className="text-5xl lg:text-7xl font-black mb-6" variants={fadeUp} initial="hidden" whileInView="visible">
              Smart Education Technology Solutions
            </motion.h1>
            <motion.p className="text-xl lg:text-2xl italic max-w-4xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible">
              Transforming learning experiences through AI-powered, scalable, and interactive education platforms.
            </motion.p>
          </div>
        </section>

        <section className="py-20 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4">EdTech Capabilities</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            We help institutions, startups, and enterprises deliver personalized, accessible,
            and data-driven education experiences.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {[
              { title: 'Learning Platforms', desc: 'AI-powered LMS and content delivery systems.' },
              { title: 'Virtual Classrooms', desc: 'Live classes, collaboration & engagement tools.' },
              { title: 'Adaptive Assessments', desc: 'Personalized exams and learning paths.' },
              { title: 'Student Analytics', desc: 'Track performance, engagement & outcomes.' },
              { title: 'Remote Learning', desc: 'Scalable global education solutions.' },
              { title: 'AI Tutors', desc: 'Smart assistants for student guidance.' }
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
            src={education}
            className="flex-1 rounded-xl shadow-lg"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          />
          <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
            <h3 className="text-2xl font-bold mb-4">Future-Ready Learning Systems</h3>
            <p className="text-gray-600">
              Our platforms adapt to learners’ needs, improve engagement, and empower educators
              with intelligent insights.
            </p>
          </motion.div>
        </section>

        <section className="bg-[#2D4DE8] text-white text-center py-16">
          <h2 className="text-3xl font-bold mb-4">Build the Future of Education</h2>
          <Link to="/contact" className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold">
            Let’s Collaborate
          </Link>
        </section>
      </div>
    </>
  );
};

export default Education;
