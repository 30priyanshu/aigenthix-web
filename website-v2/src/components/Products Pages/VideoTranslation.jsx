import React from "react";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import heroImg from "../IMAGES/s3.webp";
import {
  FaMicrophoneAlt,
  FaLanguage,
  FaBrain,
  FaVolumeUp,
  FaMusic,
  FaBolt
} from "react-icons/fa";
import LiteYouTube from "../LiteYouTube";

const demoVideo =
  "https://www.youtube.com/embed/ma02gR53l7I?si=w5TZoRSZWz-QgyM1";

const VideoTranslation = () => {
  return (
    <>
      <SEO
        title="AI Video Translation"
        description="An AI-powered system that automatically converts English videos into Hindi, Tamil, and Telugu by combining speech recognition, neural translation, language refinement, and realistic voice dubbing with precise audio-video synchronization."
        url="/products/video-translation"
        image="/video-translation-og.jpg"
      />

      <div className="min-h-screen bg-gray-50">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="h-64 md:h-96 w-full relative overflow-hidden">
            <img
              src={heroImg}
              alt="AI Video Translation hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* CONTENT CARD */}
          <div className="max-w-6xl mx-auto -mt-24 relative z-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 space-y-12">
              {/* TITLE */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
                  AI Video Translation
                </h1>
                <p className="text-gray-700 leading-relaxed">
                  An AI-powered system that automatically converts English videos
                  into Hindi, Tamil, and Telugu by combining speech recognition,
                  neural translation, language refinement, and realistic voice
                  dubbing with precise audio-video synchronization.
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
                      icon: FaMicrophoneAlt,
                      title: "Speech Recognition",
                      desc: "GPU-based Whisper ASR with accurate, timestamped transcription."
                    },
                    {
                      icon: FaLanguage,
                      title: "Language Translation",
                      desc: "IndicTrans2 optimized for Indian languages with high accuracy."
                    },
                    {
                      icon: FaBrain,
                      title: "Language Refinement",
                      desc: "LLM-powered simplification for natural, conversational speech."
                    },
                    {
                      icon: FaVolumeUp,
                      title: "AI Voice Dubbing",
                      desc: "Neural TTS voices with realistic pronunciation and tone."
                    },
                    {
                      icon: FaMusic,
                      title: "Perfect Audio Sync",
                      desc: "Frame-accurate alignment for smooth lip-sync and timing."
                    },
                    {
                      icon: FaBolt,
                      title: "Fast Processing",
                      desc: "Asynchronous pipelines with real-time progress tracking."
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
                  Watch how AI Video Translation processes a video—from speech
                  recognition and translation to AI dubbing and final synchronized
                  output.
                </p>

                <div className="relative rounded-xl overflow-hidden shadow-lg border aspect-video">
                  <LiteYouTube src={demoVideo} title="AI Video Translation Demo" />
                </div>
              </div>

              {/* HIGHLIGHTS */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Why Choose AI Video Translation?
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Designed specifically for Indian languages</li>
                  <li>Studio-quality AI voice dubbing</li>
                  <li>Accurate lip-sync and timing preservation</li>
                  <li>Ideal for education, media, and enterprises</li>
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

export default VideoTranslation;
