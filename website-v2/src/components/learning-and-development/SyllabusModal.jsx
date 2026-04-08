import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { contactService } from "../../services/contactService";

const SyllabusModal = ({ isOpen, onClose, pdfSrc }) => {
  const [showForm, setShowForm] = useState(false);
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

      // Trigger download
      const link = document.createElement('a');
      link.href = pdfSrc;
      link.download = "Agentic_AI_Syllabus.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        handleClose();
      }, 3000);
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

  const handleClose = () => {
    setShowForm(false);
    setSubmitStatus(null);
    setFormData({
      firstName: '', lastName: '', companyEmail: '', companyName: '',
      jobTitle: '', phoneNumber: '', country: '', comments: '', agreeToTerms: false,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4 py-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-h-[90vh] flex flex-col relative max-w-5xl overflow-hidden">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              {!showForm ? (
                <div className="flex flex-col h-full p-6">
                  <div className="mb-4 pr-8 shrink-0">
                    <h3 className="text-2xl font-bold text-blue-600">
                      Agentic AI Syllabus
                    </h3>
                  </div>
                  <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 mb-6 bg-gray-100">
                    <iframe 
                      src={`${pdfSrc}#toolbar=0&navpanes=0`} 
                      title="Syllabus PDF" 
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex justify-center gap-4 shrink-0">
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={handleClose}
                      className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto w-full bg-white px-2 py-8 sm:px-6 md:py-12">
                  <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-xl p-8 md:p-12 text-left relative">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
                      Enroll to Download
                    </h2>
                    <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
                      Please provide your basic details below to enroll. The syllabus download will start automatically upon submission.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name*" required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                      </div>
                      <div>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name*" required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                      </div>
                      <div>
                        <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} placeholder="Email Address*" required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                      </div>
                      <div>
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                      </div>
                      <div className="md:col-span-2">
                        <textarea name="comments" value={formData.comments} onChange={handleChange} placeholder="Why are you interested in this program?*" rows="4" required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"></textarea>
                      </div>
                      <div className="md:col-span-2 flex items-center mt-2">
                        <input type="checkbox" id="agreeToTermsModal" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="agreeToTermsModal" className="ml-2 text-sm text-gray-700">
                          I agree to the <Link to="/terms-of-use" className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>Terms of Use</Link> and <Link to="/privacy-policy" className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>.
                        </label>
                      </div>
                      <div className="md:col-span-2 mt-4 flex flex-col sm:flex-row gap-4">
                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-md transition duration-300 shadow-md">
                          {isSubmitting ? 'Submitting...' : 'Enroll and Download'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-300 bg-white rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm">
                          Back to PDF
                        </button>
                      </div>
                      {submitStatus === 'success' && (
                        <div className="md:col-span-2 text-green-700 text-sm font-medium text-center bg-green-50 p-3 rounded-md border border-green-200">
                          Thank you! Your download should start automatically.
                        </div>
                      )}
                      {submitStatus === 'error' && (
                        <div className="md:col-span-2 text-red-700 text-sm font-medium text-center bg-red-50 p-3 rounded-md border border-red-200">
                          We could not submit your request right now. Please try again shortly.
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SyllabusModal;
