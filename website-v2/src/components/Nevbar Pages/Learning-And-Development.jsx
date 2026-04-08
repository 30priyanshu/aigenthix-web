import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../SEO";

import dataEngineeringImg from "../IMAGES/Learning And Development images/DataEngineering.webp";
import dataAnalyticsImg from "../IMAGES/Learning And Development images/DataAnalytics.webp";
import aiMlImg from "../IMAGES/Learning And Development images/AIML.webp";
import generativeAiImg from "../IMAGES/Learning And Development images/GenerativeAi.webp";
import mlopsImg from "../IMAGES/Learning And Development images/MLOps.webp";
import agenticAiImg from "../IMAGES/Learning And Development images/AgenticAi.webp";
import agenticAiSyllabusPdf from "../learning-and-development/Syllabus-pdf/Agentic_AI_Syllabus.pdf";
import SyllabusModal from "../learning-and-development/SyllabusModal";

/* =========================================================
   GLOBAL IMAGE STYLE (SAME SIZE EVERYWHERE)
   ========================================================= */
const IMAGE_CLASS =
  "w-full h-[260px] md:h-[320px] object-cover rounded-xl shadow-lg";

/* =========================================================
   FRAMER MOTION VARIANT (SUBTLE & PREMIUM)
   ========================================================= */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* =========================================================
   L&D SECTORS DATA
   ========================================================= */
const sectors = [
  {
    title: "Data Engineering",
    slug: "data-engineering",
    image: dataEngineeringImg,
    points: [
      "Design scalable batch & streaming data pipelines",
      "ETL / ELT workflows using Python, SQL & Spark",
      "Cloud data platforms on AWS, Azure & GCP",
      "Modern data warehouses: Snowflake & BigQuery",
      "Enterprise-grade capstone project",
    ],
    audience: "Data Engineers, Backend Developers",
  },
  {
    title: "Data Analytics",
    slug: "data-analytics",
    image: dataAnalyticsImg,
    points: [
      "Excel, SQL, Power BI & Tableau mastery",
      "Business dashboards & KPI tracking",
      "Data storytelling for management decisions",
      "Finance & marketing case studies",
      "Corporate analytics workflows",
    ],
    audience: "Business Analysts, MIS Teams",
  },
  {
    title: "AI & Machine Learning",
    slug: "ai-ml",
    image: aiMlImg,
    points: [
      "Supervised & unsupervised ML algorithms",
      "Model training, validation & tuning",
      "Python, Pandas, Scikit-Learn, TensorFlow",
      "End-to-end ML pipelines",
      "Industry ML projects",
    ],
    audience: "AI Engineers, Developers",
  },
  {
    title: "AI & MLOps",
    slug: "mlops",
    image: mlopsImg,
    points: [
      "ML lifecycle & CI/CD pipelines",
      "Docker, Kubernetes & MLflow",
      "Model monitoring & retraining",
      "Cloud deployment strategies",
      "Production-ready AI systems",
    ],
    audience: "ML Engineers, DevOps Teams",
  },
  {
    title: "Generative AI",
    slug: "generative-ai",
    image: generativeAiImg,
    points: [
      "LLMs & transformer fundamentals",
      "Prompt engineering & RAG systems",
      "Chatbots & AI assistants",
      "OpenAI & open-source models",
      "Responsible enterprise GenAI",
    ],
    audience: "Product Managers, AI Teams",
  },
  {
    title: "Agentic AI",
    slug: "agentic-ai",
    image: agenticAiImg,
    points: [
      "Autonomous AI agents & workflows",
      "Tool usage, planning & memory",
      "LangChain agent architectures",
      "Enterprise automation use-cases",
      "Next-gen intelligent systems",
    ],
    audience: "R&D Teams, Advanced AI Roles",
  },
];

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
const Learning = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <SEO
        title="Learning And Development"
        description="Industry-aligned learning programs by AiGENThix — empowering individuals, upskilling teams, and preparing enterprises for an AI-first future."
      />
      <div className="min-h-screen bg-white font-['Poppins',_sans-serif]">

        {/* Hero Section (Unchanged for scope) */}
        <section className="relative py-16 about-hero">
          {/* ... Hero Content ... (omitted for brevity) */}
          <div className="absolute inset-0 hero-overlay" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 pt-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 animate-fadeInDown">
              <span className="text-blue-300 italic">AI-Driven Learning & Corporate Training</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-4xl mx-auto leading-relaxed mt-4">
              Industry-aligned learning programs by{" "}
              <span className="font-semibold text-white">AiGENThix</span> — empowering
              individuals, upskilling teams, and preparing enterprises for an
              AI-first future.
            </p>
          </div>
        </section>


        <div className="bg-white h-16 sm:h-20 md:h-28"></div>

        {/* ================= SECTORS ================= */}
        <section className="px-6 max-w-7xl mx-auto space-y-28">
          {sectors.map((sector, index) => (
            <motion.div
              key={sector.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-12 items-center`}
            >
              <div className="w-full lg:w-1/2">
                <img
                  src={sector.image}
                  alt={sector.title}
                  className={IMAGE_CLASS}
                />
              </div>

              <div className="w-full lg:w-1/2">
                <h2 className="text-3xl font-bold mb-4">{sector.title}</h2>

                <ul className="space-y-3 text-gray-700 mb-6 text-lg">
                  {sector.points.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="text-base font-semibold text-gray-700 mb-2">
                  Ideal For: {sector.audience}
                </p>

                <p className="text-base text-gray-700 mb-4">
                  Complete the program and earn a professional certificate.
                </p>


                <div className="flex gap-4 flex-wrap items-center">
                  <Link
                    to={`/learning-and-development/${sector.slug}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    {sector.slug === "agentic-ai" ? "Enroll Now →" : "Explore Program →"}
                  </Link>
                  {sector.slug === "agentic-ai" && (
                    <button
                      onClick={() => setOpenModal(true)}
                      className="text-gray-700 hover:text-blue-600 font-semibold transition flex items-center gap-1"
                    >
                      <span>Download Syllabus</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* ================= CTA ================= */}
        <section className="py-24 mt-24 bg-gray-100 px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Upskill Your Team?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
            We design customized AI learning programs aligned with your business,
            technology stack, and workforce goals.
          </p>

          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Schedule a Consultation
          </Link>
        </section>
      </div>

      <SyllabusModal 
        isOpen={openModal} 
        onClose={() => setOpenModal(false)} 
        pdfSrc={agenticAiSyllabusPdf} 
      />
    </>
  );
};

export default Learning;
