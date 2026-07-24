import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import SEO from "./SEO";
import { careersService } from "../services/careersService";

/** Max resume file size: 5 MB (reasonable for PDF/DOCX resumes) */
const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

/**
 * Validates a resume file on the client side before upload.
 * Returns an error message string, or null if valid.
 */
const validateResumeFile = (file) => {
  if (!file) return null;

  // Extension check (defense in depth — don't rely on MIME alone)
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_RESUME_EXTENSIONS.includes(ext)) {
    return `Only ${ALLOWED_RESUME_EXTENSIONS.join(", ")} files are accepted.`;
  }

  // MIME type check (browsers report this from the OS; can be spoofed, but catches honest mistakes)
  if (file.type && !ALLOWED_RESUME_TYPES.includes(file.type)) {
    return "Invalid file type. Please upload a PDF or Word document.";
  }

  // Size check
  if (file.size === 0) {
    return "The selected file is empty. Please choose a valid resume.";
  }
  if (file.size > MAX_RESUME_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return `File is too large (${sizeMB} MB). Maximum allowed size is 5 MB.`;
  }

  return null;
};

const Careers = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
    resume: null,
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const resumeInputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.name === "resume") {
      const file = e.target.files[0] || null;
      const error = validateResumeFile(file);

      if (error) {
        setFileError(error);
        setFormData({ ...formData, resume: null });
        setSelectedFileName(null);
        if (resumeInputRef.current) resumeInputRef.current.value = "";
        return;
      }

      setFileError(null);
      setSelectedFileName(file ? file.name : null);
      setFormData({ ...formData, resume: file });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final guard: don't submit without a resume
    if (!formData.resume) {
      setFileError("Please attach your resume before submitting.");
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    try {
      await careersService.submitCareersForm(formData);

      setSubmitStatus("success");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        message: "",
        resume: null,
      });
      setSelectedFileName(null);
      setFileError(null);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    } catch (err) {
      const message = err?.message || "";
      if (message.includes("resume") || message.includes("upload")) {
        setSubmitStatus("upload_error");
      } else if (message.includes("Too many")) {
        setSubmitStatus("rate_limit");
      } else {
        setSubmitStatus("error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <SEO
            title="Careers"
            description="Join the AiGENThix team and help us build the future of AI. We are looking for passionate individuals to work on innovative projects in a collaborative environment."
            url="/careers"
            image="/careers-og.jpg"
        />
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
  className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
  style={{ fontFamily: "Times New Roman, Times, serif" }}
>
  Build the Future with{" "}
  <span className="text-[#1ea5ca] Times New Roman">
    AiGENThix
  </span>
</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            We are building intelligent, secure, and scalable AI systems.
            Join our mission to create ethical AI solutions that transform industries.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#2D4DE8] rounded-full"></div>
              <p className="text-gray-700">Innovative AI Projects</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#2D4DE8] rounded-full"></div>
              <p className="text-gray-700">Collaborative Culture</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#2D4DE8] rounded-full"></div>
              <p className="text-gray-700">Growth & Leadership Opportunities</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Apply Now
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <InputField name="fullName" placeholder="Full Name" onChange={handleChange} value={formData.fullName} required />
            <InputField name="email" type="email" placeholder="Email Address" onChange={handleChange} value={formData.email} required />
            <InputField name="phone" placeholder="Phone Number" onChange={handleChange} value={formData.phone} />
            <InputField name="position" placeholder="Position Applying For" onChange={handleChange} value={formData.position} required />
            <InputField name="experience" placeholder="Years of Experience" onChange={handleChange} value={formData.experience} />

            <textarea
              name="message"
              placeholder="Why should we hire you?"
              rows="4"
              onChange={handleChange}
              value={formData.message}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2D4DE8] focus:ring-2 focus:ring-[#2D4DE8]/20 outline-none transition"
            />

            {/* Resume upload with validation feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal ml-1">(PDF, DOC, DOCX — max 5 MB)</span>
              </label>
              <input
                ref={resumeInputRef}
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-[#2D4DE8] hover:file:bg-blue-100 transition"
              />
              {selectedFileName && !fileError && (
                <p className="mt-1 text-sm text-green-600">
                  ✓ {selectedFileName}
                </p>
              )}
              {fileError && (
                <p className="mt-1 text-sm text-red-600">{fileError}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || !!fileError}
              className="w-full bg-[#2D4DE8] hover:bg-[#1f3ed1] disabled:bg-[#9ca3af] text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
            >
              {loading ? "Uploading & Submitting..." : "Submit Application"}
            </motion.button>

            {submitStatus === "success" && (
              <div className="text-green-700 text-sm font-medium text-center">
                Application submitted successfully! We'll get back to you soon.
              </div>
            )}
            {submitStatus === "error" && (
              <div className="text-red-700 text-sm font-medium text-center">
                Something went wrong. Please try again later.
              </div>
            )}
            {submitStatus === "upload_error" && (
              <div className="text-red-700 text-sm font-medium text-center">
                Failed to upload your resume. Please check the file and try again.
              </div>
            )}
            {submitStatus === "rate_limit" && (
              <div className="text-amber-700 text-sm font-medium text-center">
                Too many submissions. Please wait a few minutes and try again.
              </div>
            )}

          </form>
        </motion.div>
      </div>
    </div>
    </>
  );
};

const InputField = ({ name, type = "text", placeholder, onChange, value, required = false }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    required={required}
    onChange={onChange}
    value={value}
    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2D4DE8] focus:ring-2 focus:ring-[#2D4DE8]/20 outline-none transition"
  />
);


export default Careers;