import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../SEO";
import { breadcrumbSchema } from "../../lib/seo.schemas";

import generativeAIImg from "../IMAGES/Services Page images/GenerativeAi.webp";
import aiMlImg from "../IMAGES/Services Page images/AIML.webp";
import roboticsImg from "../IMAGES/Services Page images/Robotics.webp";
import humanoidImg from "../IMAGES/Services Page images/Humanoid.webp";
import cyberSecurityImg from "../IMAGES/Services Page images/Cybersecurity.webp";
import dataEngineeringImg from "../IMAGES/Services Page images/DataEngineering.webp";
import web3Img from "../IMAGES/Services Page images/Web3.webp";
import softwareDevImg from "../IMAGES/Services Page images/SoftwareDevelopment.webp";
import iotImg from "../IMAGES/Services Page images/IOT.webp";
import apiIntegrationImg from "../IMAGES/Services Page images/APIIntegration.webp";
import blockchainImg from "../IMAGES/Services Page images/Blockchain.webp";

/* =========================================================
   IMAGE STYLE (OPTIMIZED + RESPONSIVE)
   ========================================================= */
const IMAGE_CLASS =
  "w-full h-[260px] md:h-[320px] object-cover rounded-xl shadow-md";

/* =========================================================
   FRAMER MOTION (LIGHT PERFORMANCE)
   ========================================================= */
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

/* =========================================================
   SERVICES DATA (FULL LIST)
   ========================================================= */
const services = [
  {
    title: "Generative AI",
    slug: "generative-ai",
    image: generativeAIImg,
    points: [
      "LLM-powered applications & AI agents",
      "RAG-based enterprise knowledge systems",
      "Chatbots & virtual assistants",
      "Prompt engineering & fine-tuning",
      "Secure enterprise GenAI adoption",
    ],
    audience: "Enterprises, Product Teams",
  },
  {
    title: "Artificial Intelligence & ML",
    slug: "ai-ml",
    image: aiMlImg,
    points: [
      "Predictive & prescriptive ML models",
      "Computer vision & NLP systems",
      "Deep learning architectures",
      "End-to-end ML pipelines",
      "Business-focused AI solutions",
    ],
    audience: "Enterprises, Startups",
  },
  {
    title: "Robotics",
    slug: "robotics",
    image: roboticsImg,
    points: [
      "Industrial & service robotics",
      "AI-powered automation systems",
      "ROS-based robotic solutions",
      "Vision & sensor integration",
      "Robotic process optimization",
    ],
    audience: "Manufacturing, R&D Labs",
  },
  {
    title: "Humanoid Systems",
    slug: "humanoids",
    image: humanoidImg,
    points: [
      "Human-like motion & perception",
      "AI vision & speech interaction",
      "Cognitive decision systems",
      "Human–robot interaction (HRI)",
      "Next-gen humanoid research",
    ],
    audience: "Research & Innovation Teams",
  },
  {
    title: "Cybersecurity",
    slug: "cybersecurity",
    image: cyberSecurityImg,
    points: [
      "Threat detection & prevention",
      "Secure system architecture",
      "Penetration testing",
      "Zero-trust security models",
      "Compliance & risk management",
    ],
    audience: "Enterprises & FinTech",
  },
  {
    title: "Data Engineering",
    slug: "data-engineering",
    image: dataEngineeringImg,
    points: [
      "Scalable data pipelines",
      "ETL / ELT workflows",
      "Cloud data platforms",
      "Analytics-ready datasets",
      "AI training data systems",
    ],
    audience: "Data-driven Organizations",
  },
  {
    title: "Web3 Development",
    slug: "web3",
    image: web3Img,
    points: [
      "Decentralized applications",
      "DeFi & NFT platforms",
      "DAO systems",
      "Blockchain integrations",
      "Trustless architectures",
    ],
    audience: "Blockchain Startups",
  },
  {
    title: "Software Development",
    slug: "software-development",
    image: softwareDevImg,
    points: [
      "Custom web & mobile apps",
      "SaaS platforms",
      "UI/UX-driven development",
      "Cloud-native solutions",
      "Enterprise software systems",
    ],
    audience: "Startups & Enterprises",
  },
  {
    title: "IoT & Embedded Systems",
    slug: "iot-embedded",
    image: iotImg,
    points: [
      "Smart devices & sensors",
      "Embedded firmware",
      "Industrial IoT platforms",
      "Edge computing",
      "Real-time analytics",
    ],
    audience: "Manufacturing & Smart Cities",
  },
  {
    title: "API Integration Services",
    slug: "api-integration",
    image: apiIntegrationImg,
    points: [
      "REST & GraphQL APIs",
      "Microservices architecture",
      "Third-party integrations",
      "Secure API gateways",
      "System interoperability",
    ],
    audience: "Digital Platforms",
  },
  {
    title: "Blockchain Technology",
    slug: "blockchain",
    image: blockchainImg,
    points: [
      "Smart contract development",
      "Enterprise blockchain solutions",
      "dApps & tokenization",
      "Secure ledger systems",
      "Cross-chain integrations",
    ],
    audience: "FinTech & Web3 Firms",
  },
];

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
const Services = () => {


  return (
    <>
        <SEO
            title="AI Services - Generative AI, ML, Robotics & More"
            description="End-to-end AI, software, and deep-tech solutions helping businesses innovate, scale, and lead in a digital-first world. Generative AI, Machine Learning, Robotics, Cybersecurity, Data Engineering."
            keywords="AI services, generative AI services, machine learning consulting, robotics development, cybersecurity AI, data engineering, blockchain, IoT, AiGENThix"
            structuredData={breadcrumbSchema([{ name: 'Services', path: '/services' }])}
        />
        <div className="min-h-screen bg-white font-['Poppins',_sans-serif]">

            {/* Hero Section (Unchanged for scope) */}
            <section className="relative py-16 about-hero">
                {/* ... Hero Content ... (omitted for brevity) */}
                <div className="absolute inset-0 hero-overlay" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 pt-16">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 animate-fadeInDown">
                        <span className="text-blue-300 italic">Our Technology Services</span>
                    </h1>
                    <p className="text-xl text-gray-100 max-w-4xl mx-auto leading-relaxed mt-4">
                        End-to-end AI, software, and deep-tech solutions helping businesses
            innovate, scale, and lead in a digital-first world.
                    </p>
                </div>
            </section>

      <div className="h-24" />

      {/* ================= SERVICES ================= */}
      <section className="px-6 max-w-7xl mx-auto space-y-24">
        {services.map((service, index) => (
          <motion.div
            key={service.slug}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className={`flex flex-col ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } gap-12 items-center`}
          >
            {/* IMAGE */}
            <div className="w-full lg:w-1/2">
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
                className={IMAGE_CLASS}
              />
            </div>

            {/* CONTENT */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-bold mb-4">{service.title}</h2>

              <ul className="space-y-3 text-gray-700 mb-6">
                {service.points.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    {p}
                  </li>
                ))}
              </ul>

              <p className="text-sm font-semibold text-gray-500 mb-4">
                Ideal For: {service.audience}
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link
                  to={`/services/${service.slug}`}
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Learn More →
                </Link>

                <Link
                  to="/contact"
                  className="text-gray-600 font-semibold hover:underline"
                >
                  Talk to an Expert
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 mt-28 bg-gray-100 px-6 text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Have a Complex Tech Challenge?
        </h3>

        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Our experts design custom AI and technology solutions tailored to your
          business goals.
        </p>

        <Link
          to="/contact"
          className="inline-block px-10 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition"
        >
          Start a Conversation
        </Link>
      </section>
    </div>
    </>
  );
};

export default Services;
