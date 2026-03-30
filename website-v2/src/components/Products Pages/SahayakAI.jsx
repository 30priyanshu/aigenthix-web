import React from "react";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import {
  FaFileAlt,
  FaBrain,
  FaCamera,
  FaChartBar,
  FaBullseye,
  FaChalkboardTeacher
} from "react-icons/fa";
import LiteYouTube from "../LiteYouTube";
import heroImg from "../IMAGES/s2.webp";

const demoVideo =
  "https://www.youtube.com/embed/jis1Hckpx9U?si=tu7vAgA13lIfnfHP";

const SahayakAI = () => {

  return (
    <>
      <SEO
        title="Sahayak AI"
        description="An AI-powered education platform designed to help teachers create content faster, manage classrooms intelligently, and gain actionable insights to improve student outcomes."
        url="/products/sahayak-ai"
        image="/sahayak-ai-og.jpg"
      />

      <div className="min-h-screen bg-gray-50">
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* HERO IMAGE */}
          <div className="h-60 sm:h-72 md:h-96 w-full relative overflow-hidden">
            <img
              src={heroImg}
              alt="Sahayak AI hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* CONTENT CARD */}
          <div className="max-w-6xl mx-auto -mt-20 sm:-mt-24 relative z-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 space-y-12">
              {/* TITLE */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
                  Sahayak AI
                </h1>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  An AI-powered education platform designed to help teachers
                  create content faster, manage classrooms intelligently,
                  and gain actionable insights to improve student outcomes.
                </p>
              </div>

              {/* FEATURES */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-6">
                  Platform Capabilities
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: FaFileAlt,
                      title: "AI Content Creation",
                      desc: "Generate worksheets, quizzes, lesson plans, and presentations aligned with curriculum."
                    },
                    {
                      icon: FaBrain,
                      title: "Smart Lesson Planning",
                      desc: "Auto-structured lesson plans with objectives, timelines, and resources."
                    },
                    {
                      icon: FaCamera,
                      title: "Attendance Automation",
                      desc: "Face recognition–based attendance with real-time insights and reports."
                    },
                    {
                      icon: FaChartBar,
                      title: "Student Performance Tracking",
                      desc: "Digital gradebooks, progress analytics, and outcome-based evaluation."
                    },
                    {
                      icon: FaBullseye,
                      title: "Student Mentorship",
                      desc: "AI-driven academic guidance, goal tracking, and intervention support."
                    },
                    {
                      icon: FaChalkboardTeacher,
                      title: "Teacher Development",
                      desc: "Personalized professional growth plans and training recommendations."
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
                  Watch how Sahayak AI helps educators plan lessons, manage
                  classrooms, automate attendance, and track student performance.
                </p>

                <div className="relative rounded-xl overflow-hidden shadow-lg border aspect-video">
                  <LiteYouTube src={demoVideo} title="Sahayak AI Demo" />
                </div>
              </div>

              {/* HIGHLIGHTS */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Why Choose Sahayak AI?
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm sm:text-base">
                  <li>Reduces teacher workload using AI automation</li>
                  <li>Improves learning outcomes with real-time insights</li>
                  <li>Scalable for schools, colleges, and institutions</li>
                  <li>Designed for modern digital classrooms</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  to="/contact"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow w-full sm:w-auto text-center"
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

export default SahayakAI;
