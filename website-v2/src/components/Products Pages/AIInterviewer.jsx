import React from "react";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import {
  FaFileAlt,
  FaRobot,
  FaBullseye,
  FaMicrophoneAlt,
  FaChartLine,
  FaCogs
} from "react-icons/fa";
import LiteYouTube from "../LiteYouTube";
import heroImg from "../IMAGES/s1.webp";


const demoVideo =
  "https://www.youtube.com/embed/6JaS7H4ewqI?si=lQ4TAokNc5EwXq3q";

const AIInterviewer = () => {
  return (
    <>
      <SEO
        title="AI Interviewer"
        description="An AI-powered interview preparation platform that analyzes resumes, generates role-specific questions, conducts realistic interviews, and delivers actionable feedback through text and voice-based interactions."
        url="/products/ai-interviewer"
        image="/ai-interviewer-og.jpg"
      />

      <div className="min-h-screen bg-gray-50">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="h-64 md:h-96 w-full relative overflow-hidden">
            <img
              src={heroImg}
              alt="AI Interviewer hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="max-w-6xl mx-auto -mt-24 relative z-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 space-y-12">
              {/* TITLE */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
                  AI Interviewer
                </h1>
                <p className="text-gray-700 leading-relaxed">
                  An AI-powered interview preparation platform that analyzes
                  resumes, generates role-specific questions, conducts realistic
                  interviews, and delivers actionable feedback through text and
                  voice-based interactions.
                </p>
              </div>

              {/* FEATURE CARDS */}
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Platform Capabilities
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: FaFileAlt,
                      title: "Resume Analysis",
                      desc: "ATS scoring, skill extraction, section-wise evaluation, formatting and keyword optimization."
                    },
                    {
                      icon: FaRobot,
                      title: "AI Interview Agent",
                      desc: "Dynamic, context-aware interviews with intelligent follow-up questions and real-time scoring."
                    },
                    {
                      icon: FaBullseye,
                      title: "Role & Exam Specific",
                      desc: "Tailored interviews for HR, technical, behavioral, MBA, banking, and competitive exams."
                    },
                    {
                      icon: FaMicrophoneAlt,
                      title: "Voice & Text Mode",
                      desc: "Conduct interviews via voice or text with natural conversation flow and speech recognition."
                    },
                    {
                      icon: FaChartLine,
                      title: "Performance Reports",
                      desc: "Detailed analytics, strengths, weaknesses, trends, and improvement recommendations."
                    },
                    {
                      icon: FaCogs,
                      title: "Admin & Management",
                      desc: "Manage question banks, exams, users, sessions, reports, and bulk operations."
                    }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="bg-gray-50 border rounded-xl p-6 hover:shadow-lg transition duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <Icon className="text-xl text-gray-700 mt-1 shrink-0" />

                          <div>
                            <h4 className="font-semibold text-lg mb-1">
                              {item.title}
                            </h4>

                            <p className="text-sm text-gray-600">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </div>

                    );
                  })}
                </div>
              </div>

              {/* DEMO VIDEO */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Platform Demo</h2>
                <p className="text-gray-600 mb-6">
                  Watch how AI Interviewer analyzes resumes, conducts AI-driven
                  interviews, and generates detailed performance feedback.
                </p>

                <div className="relative rounded-xl overflow-hidden shadow-lg border aspect-video">
                  <LiteYouTube src={demoVideo} title="AI Interviewer Demo" />
                </div>
              </div>

              {/* HIGHLIGHTS */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Why Choose AI Interviewer?
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Real interview pressure with AI-driven adaptability</li>
                  <li>Instant feedback instead of generic mock tests</li>
                  <li>Scalable for individuals, institutes, and enterprises</li>
                  <li>Designed for both freshers and experienced professionals</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  to="/contact"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow"
                >
                  Try for Free
                </Link>
                <Link
                  to="/products"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIInterviewer;
