import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import agenticAiImg from "../IMAGES/Learning And Development images/AgenticAi.webp";
import { contactService } from "../../services/contactService";
import agenticAiSyllabusPdf from "./Syllabus-pdf/Agentic_AI_Syllabus.pdf";
import SyllabusModal from "./SyllabusModal";

const IMAGE_CLASS =
  "w-full h-[260px] md:h-[320px] object-cover rounded-xl shadow-lg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const AgenticAI = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', companyEmail: '', companyName: '',
    jobTitle: '', phoneNumber: '', country: '', comments: '', agreeToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await contactService.submitContactForm(formData);
      setSubmitStatus('success');
      setFormData({
        firstName: '', lastName: '', companyEmail: '', companyName: '',
        jobTitle: '', phoneNumber: '', country: '', comments: '', agreeToTerms: false,
      });
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  return (
    <>
      <SEO
        title="Agentic AI Training - Build Autonomous AI Agents"
        description="Learn to build autonomous AI agents that reason, plan, use tools, and execute complex tasks independently. Our Agentic AI training covers architectures, tool integration, memory systems, multi-agent coordination, and secure deployment for real-world applications."
        url="/learning-and-development/agentic-ai"
        image="/agentic-ai-og.jpg"
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
                Agentic AI
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Build autonomous AI agents that reason, plan, use tools, and execute complex tasks independently.
              </p>

              <div className="flex gap-4 flex-wrap">
                {/* Updated Button */}
                <button
                  onClick={() => setOpenModal(true)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Download Syllabus
                </button>
                <a
                  href="#enroll-form-section"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Enroll Now
                </a>
              </div>
            </div>

            <img
              src={agenticAiImg}
              alt="Agentic AI"
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
                "Autonomous Agent Architectures",
                "Tool Calling & Function Execution",
                "Memory & Planning Systems",
                "Multi-Agent Coordination",
                "RAG for Agents",
                "Secure Agent Deployment",
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
                "LangGraph",
                "AutoGen",
                "CrewAI",
                "OpenAI API",
                "Vector Databases",
                "FastAPI",
                "Redis",
                "Docker",
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
                "Autonomous research agents",
                "Customer support automation",
                "Workflow orchestration bots",
                "Enterprise task automation",
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
              Prepare to design autonomous systems powering the next AI revolution.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Agentic AI Engineer",
                "Autonomous Systems Developer",
                "AI Automation Architect",
                "LLM Agent Engineer",
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

        {/* ================= ENROLL FORM ================= */}
        <section id="enroll-form-section" className="py-24 bg-white px-6">
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
              Enroll in Agentic AI
            </h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              Please provide your basic details below, and our team will get back to you with the next steps.
            </p>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name*" required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name*" required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} placeholder="Email Address*" required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <textarea name="comments" value={formData.comments} onChange={handleChange} placeholder="Why are you interested in this program?*" rows="4" required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div className="md:col-span-2 flex items-center mt-2">
                <input type="checkbox" id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                  I agree to the <Link to="/terms-of-use" className="text-blue-600 hover:underline">Terms of Use</Link> and <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                </label>
              </div>
              <div className="md:col-span-2 mt-4">
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-md transition duration-300">
                  {isSubmitting ? 'Submitting...' : 'Submit Enrollment Application'}
                </button>
              </div>
              {submitStatus === 'success' && (
                <div className="md:col-span-2 text-green-700 text-sm font-medium text-center">
                  Thank you for enrolling! We will be in touch shortly.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="md:col-span-2 text-red-700 text-sm font-medium text-center">
                  We could not submit your request right now. Please try again shortly.
                </div>
              )}
            </form>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="py-24 bg-blue-600 text-white text-center px-6">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Build Autonomous AI Agents
          </h3>
          <p className="mb-8 max-w-2xl mx-auto text-blue-100">
            Learn to create AI systems that think, act, and evolve independently.
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Talk to an Advisor
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

export default AgenticAI;
