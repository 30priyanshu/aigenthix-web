import React, { useEffect, useState } from "react";
import logoImg from "./IMAGES/aigenthix.webp";
import { FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import ChatbotWidget from "./Chatbot/ChatbotWidget";

const Footer = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTop(true);
      } else {
        setShowTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Gradient Divider */}
      <div className="w-full h-[2px] bg-gradient-to-r from-[#2D4DE8] to-transparent"></div>

      <footer className="bg-[#000A1A] text-white font-poppins relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-20 py-12">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center justify-center">
              <img
                src={logoImg}
                onClick={() => window.location.href = "/"}
                alt="AiGenthix Logo"
                className="w-44 h-22 object-contain filter brightness-0 invert contrast-100"
              />
            </div>
            <p className="text-gray-400 text-sm text-center sm:text-right max-w-lg leading-relaxed">
              Envisioning the future with ethical AI — building intelligent,
              secure, and scalable solutions for the world’s most innovative
              companies.
            </p>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
            {/* COMPANY */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase mb-4 tracking-wide">
                Company
              </h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-[#2D4DE8] text-sm">About Us</a></li>
                <li><a href="/industries" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Industries</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Careers</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Case Studies</a></li>
                <li><a href="/terms-of-use" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Terms of Use</a></li>
                <li><a href="/privacy-policy" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Privacy Policy</a></li>
              </ul>
            </div>

            {/* SERVICES */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase mb-4 tracking-wide">
                Services
              </h3>
              <ul className="space-y-2">
                <li><a href="/services/generative-ai" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Generative AI</a></li>
                <li><a href="/services/ai-ml" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Artificial Intelligence & ML</a></li>
                <li><a href="/services/robotics" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Robotics</a></li>
                <li><a href="/services/humanoids" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Humanoids</a></li>
                <li><a href="/services/cybersecurity" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Cybersecurity</a></li>
                <li><a href="/services/web3" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Web3</a></li>
              </ul>
            </div>

            {/* PRODUCTS */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase mb-4 tracking-wide">
                Products
              </h3>
              <ul className="space-y-2">
                <li><a href="/products/sahayak-ai" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Sahyak AI</a></li>
                <li><a href="/products/video-translation" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Video Translation</a></li>
                <li><a href="/products/ai-interviewer" className="text-gray-400 hover:text-[#2D4DE8] text-sm">AI Interviewer</a></li>
                <li><a href="/products/project-management" className="text-gray-400 hover:text-[#2D4DE8] text-sm">Project Management Tool</a></li>
              </ul>
            </div>

           {/* CONTACT Column */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase mb-4 tracking-wide">
                Contact Us
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">AiGENThix</p>
                <p className="text-gray-400 text-sm">
                  HSR Layout, Bengaluru, Karnataka, India
                </p>
                <a
                  href="/contact"
                  className="text-[#2db9e8] hover:text-[#3c74b0] text-sm block"
                >
                  info@aigenthix.com
                </a>
                <a
                  href="https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcSHwrwztNPZLhPzxRmnfvHlpKCTQkzTXcTmjTDXNjNZpRwgWSZXNKnMbQLXmtzgTfkVTkwhR"
                  className="text-[#2db9e8] hover:text-[#3c74b0] text-sm block"
                >
                  aigenthix@gmail.com
                </a>
                <p className="text-gray-400 text-sm">+91 9419904765</p>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-4 mt-6">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-[#2D4DE8] p-2 rounded-full transition-all duration-300"
                >
                  <FaTwitter className="text-white text-lg" />
                </a>
                <a
                  href="https://www.linkedin.com/company/aigenthix-technologies/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-[#2D4DE8] p-2 rounded-full transition-all duration-300"
                >
                  <FaLinkedin className="text-white text-lg" />
                </a>
                <a
                  href="https://www.youtube.com/@Aiprojects-h3c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-[#2D4DE8] p-2 rounded-full transition-all duration-300"
                >
                  <FaYoutube className="text-white text-lg" />
                </a>
                
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 AiGenthix. All Rights Reserved.
            </p>
          </div>
        </div>

        {/* Scroll To Top */}
        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-8 bg-[#2D4DE8]/60 hover:bg-[#2D4DE8]/90 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-40 backdrop-blur"
            aria-label="Scroll to top"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        )}
        {/* Global chatbot widget (fixed, appears on all pages) */}
        <ChatbotWidget />
      </footer>
    </>
  );
};

export default Footer;
