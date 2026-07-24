import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

// Plain-text answers for FAQPage structured data (Google rich results)
const faqSchemaData = [
  { question: "What is AiGenthix and what does your company do?", answer: "AiGenthix is an AI consulting and solutions company specializing in cutting-edge artificial intelligence applications across multiple industries. We help businesses harness AI to improve efficiency, automation, and decision-making. Our expertise spans healthcare, education, finance, governance, and enterprise AI, offering AI-driven consulting, training, and research & development services." },
  { question: "What AI services does AiGenthix offer?", answer: "We provide three core AI services: 1. AI Consulting – We help businesses develop and integrate AI strategies for automation and efficiency. 2. AI Training & Workforce Upskilling – We offer AI workshops, machine learning bootcamps, and corporate training. 3. AI Research & Development – We build custom AI solutions, conduct AI safety research, and innovate in NLP, computer vision, and predictive analytics." },
  { question: "What makes AiGenthix different from other AI consulting firms?", answer: "AiGenthix stands out because of our Ethical AI Approach prioritizing fairness and transparency, Industry-Specific Expertise tailoring AI solutions, Comprehensive AI Services offering consulting, training, and R&D under one roof, and Commitment to Social Impact building AI that enhances human well-being." },
  { question: "Can AiGenthix develop custom AI solutions for my business?", answer: "Yes! We specialize in developing custom AI models tailored to your business needs. Whether it's predictive analytics, computer vision, NLP, or automation, we design AI-powered solutions that integrate seamlessly with your operations." },
  { question: "How can AI help my business?", answer: "AI can help your business by automating repetitive tasks, improving decision-making with data-driven insights, enhancing customer experience with chatbots and personalization, and optimizing operations with AI-driven supply chain and workflow automation." },
  { question: "How can I get started with AiGenthix?", answer: "Step 1: Contact us via email or our website. Step 2: Schedule a consultation with our AI experts. Step 3: We assess your business requirements and propose a customized AI solution. Step 4: Implementation, training, and support to ensure AI success." },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqSchemaData.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

// --- FAQ Data ---
const faqData = [
  {
    question: "What is AiGenthix and what does your company do?",
    answer: (
      <>
        AiGenthix is an AI consulting and solutions company specializing in cutting-edge artificial intelligence applications across multiple industries. We help businesses harness AI to improve efficiency, automation, and decision-making. Our expertise spans{" "}
        <span className="font-semibold text-gray-800">healthcare, education, finance, governance, and enterprise AI</span>, offering AI-driven consulting, training, and research & development services.
      </>
    ),
  },
  {
    question: "What AI services does AiGenthix offer?",
    answer: (
      <>
        We provide three core AI services:
        <ol className="list-none space-y-3 mt-3">
          <li><span className="font-semibold text-gray-800">1. AI Consulting</span> – We help businesses develop and integrate AI strategies for automation and efficiency.</li>
          <li><span className="font-semibold text-gray-800">2. AI Training & Workforce Upskilling</span> – We offer AI workshops, machine learning bootcamps, and corporate training.</li>
          <li><span className="font-semibold text-gray-800">3. AI Research & Development</span> – We build custom AI solutions, conduct AI safety research, and innovate in NLP, computer vision, and predictive analytics.</li>
        </ol>
      </>
    ),
  },
  {
    question: "What makes AiGenthix different from other AI consulting firms?",
    answer: (
      <>
        AiGenthix stands out because of our:
        <ul className="list-disc list-inside space-y-2 mt-3 text-gray-700">
          <li><span className="font-semibold text-gray-800">Ethical AI Approach</span> – We prioritize fairness, transparency, and accountability in AI development.</li>
          <li><span className="font-semibold text-gray-800">Industry-Specific Expertise</span> – We tailor AI solutions to meet the specific needs of each industry.</li>
          <li><span className="font-semibold text-gray-800">Comprehensive AI Services</span> – We offer consulting, training, and R&D under one roof.</li>
          <li><span className="font-semibold text-gray-800">Commitment to Social Impact</span> – We build AI that enhances human well-being and business growth.</li>
        </ul>
      </>
    ),
  },
  {
    question: "Can AiGenthix develop custom AI solutions for my business?",
    answer: (
      <>
        Yes! We specialize in developing <span className="font-semibold text-gray-800">custom AI models</span> tailored to your business needs. Whether it's{" "}
        <span className="font-semibold text-gray-800">predictive analytics, computer vision, NLP, or automation</span>, we design AI-powered solutions that integrate seamlessly with your operations.
      </>
    ),
  },
  {
    question: "How can AI help my business?",
    answer: (
      <>
        <ol className="list-none space-y-3 mt-3">
          <li><span className="font-semibold text-gray-800">1. Automate repetitive tasks</span> – Save time and reduce costs.</li>
          <li><span className="font-semibold text-gray-800">2. Improve decision-making</span> – Data-driven insights for better business strategies.</li>
          <li><span className="font-semibold text-gray-800">3. Enhance customer experience</span> – AI-powered chatbots, recommendation engines, and personalization.</li>
          <li><span className="font-semibold text-gray-800">4. Optimize operations</span> – AI-driven supply chain, inventory management, and workflow automation.</li>
        </ol>
        <p className="mt-4">We work with you to identify high-impact AI use cases for your business.</p>
      </>
    ),
  },
  {
    question: "How can I get started with AiGenthix?",
    answer: (
      <>
        <ul className="list-none space-y-3 mt-3">
          <li><span className="font-semibold text-gray-800">Step 1:</span> Contact us via email or our website to discuss your AI needs.</li>
          <li><span className="font-semibold text-gray-800">Step 2:</span> Schedule a consultation with our AI experts.</li>
          <li><span className="font-semibold text-gray-800">Step 3:</span> We assess your business requirements and propose a customized AI solution.</li>
          <li><span className="font-semibold text-gray-800">Step 4:</span> Implementation, training, and support to ensure AI success.</li>
        </ul>
        <p className="mt-4 text-lg font-medium text-gray-800">Let's build the future of AI—together!</p>
      </>
    ),
  },
];

// --- Reusable FAQ Item Component ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4 sm:py-6">
      <button
        className="w-full flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Question in Black */}
        <h3 className={`text-lg sm:text-xl font-medium text-black hover:text-gray-800 transition duration-200`}>
          {question}
        </h3>

        {/* Arrow Icon */}
        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Answer Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-sm sm:text-base text-gray-600 pr-2 sm:pr-10 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

// --- Main FAQ Section ---
const FAQ = () => {
  return (
    <>
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
    <section className="bg-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            Please reach us at{" "}
            <a href="mailto:info@aigenthix.com" className="text-blue-600 hover:text-blue-800 underline">
              info@aigenthix.com
            </a>{" "}
            if you cannot find an answer to your question.
          </p>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-lg shadow-sm">
          {faqData.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default FAQ;

