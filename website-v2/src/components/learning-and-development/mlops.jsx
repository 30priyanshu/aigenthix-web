import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import mlopsImg from "../IMAGES/Learning And Development images/MLOps.webp";

const IMAGE_CLASS =
  "w-full h-[280px] md:h-[340px] object-cover rounded-2xl shadow-xl";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const AIMLOps = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
        <SEO
            title="AI & MLOps Training - Deploy & Scale AI Models"
            description="Learn how to deploy, monitor, version, and scale AI models in real-world production systems. Our AI & MLOps training covers model deployment pipelines, CI/CD for ML, model monitoring, experiment tracking, and scalable inference systems for practical MLOps skills."
            url="/learning-and-development/ai-mlops"
            image="/ai-mlops-og.jpg"
        />
    <div className="bg-white text-gray-900 font-['Poppins',sans-serif]">

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI & MLOps
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Learn how to deploy, monitor, version, and scale AI models in real-world production systems.
            </p>

           <div className="flex gap-4 flex-wrap">
                {/* Updated Button */}
                <button
                  onClick={() => setOpenModal(true)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Download Syllabus
                </button>
              <Link
                to="/contact"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Enroll Now
              </Link>
            </div>
          </div>

          <img
            src={mlopsImg}
            alt="AI MLOps"
            className={IMAGE_CLASS}
          />
        </motion.div>
      </section>

      {/* ================= WHAT YOU WILL LEARN ================= */}
      <section className="py-24 bg-gray-50 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            What You Will Learn
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Model Deployment Pipelines",
              "CI/CD for ML Systems",
              "Model Monitoring & Drift",
              "Experiment Tracking",
              "Scalable Inference Systems",
              "Security & Governance",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <p className="font-semibold text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ================= TOOLS & TECHNOLOGIES ================= */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Tools & Technologies
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-center">
            {[
              "Docker",
              "Kubernetes",
              "MLflow",
              "Kubeflow",
              "Airflow",
              "FastAPI",
              "Terraform",
              "Prometheus",
            ].map((tool, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg py-4 font-semibold text-gray-700"
              >
                {tool}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ================= USE CASES ================= */}
      <section className="py-24 bg-gray-50 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Industry Use Cases
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Real-time ML model serving",
              "Continuous training systems",
              "Enterprise AI pipelines",
              "Model governance platforms",
            ].map((usecase, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow"
              >
                {usecase}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ================= CAREER OUTCOMES ================= */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Career Outcomes
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-10">
            Prepare for production-grade AI engineering and operations roles.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              "MLOps Engineer",
              "AI Platform Engineer",
              "ML Infrastructure Engineer",
              "DevOps for AI",
            ].map((role, i) => (
              <span
                key={i}
                className="px-5 py-3 bg-blue-100 text-blue-700 font-semibold rounded-full"
              >
                {role}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-blue-600 text-white text-center px-6">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Deploy AI at Scale
        </h3>
        <p className="mb-8 max-w-2xl mx-auto text-blue-100">
          Learn to operate AI systems reliably in real production environments.
        </p>
        <Link
          to="/contact"
          className="inline-block px-10 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition"
        >
          Talk to an Advisor
        </Link>
      </section>
    </div>
    {/* ================= COMING SOON MODAL ================= */}
      <AnimatePresence>
        {openModal && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center relative">

                <h3 className="text-2xl font-bold mb-4 text-blue-600">
                  Coming Soon...!
                </h3>

                <p className="text-gray-600 mb-6">
                  The syllabus will be available shortly. Stay tuned!
                </p>

                <button
                  onClick={() => setOpenModal(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIMLOps;
