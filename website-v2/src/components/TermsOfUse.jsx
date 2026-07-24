import React from "react";
import SEO from "../components/SEO";

const TermsOfUse = () => {

  const legalSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Use",
    url: "https://www.aigenthix.com/terms-of-use"
  };

  return (
    <>
      <SEO
        title="Terms of Use"
        description="Review the official Terms of Use governing the use of AiGENThix website and services."
        url="/terms-of-use"
        schema={[legalSchema]}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10">

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Use
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last Updated: 2026
          </p>

          <Section
            title="1. Acceptance of Terms"
            content="By accessing or using the AiGENThix website and services, you agree to comply with these Terms of Use. If you do not agree, you must discontinue use immediately."
          />

          <Section
            title="2. Services Overview"
            content="AiGENThix provides enterprise digital transformation, AI consulting, automation solutions, and related technology services. All services are subject to separate contractual agreements where applicable."
          />

          <Section
            title="3. User Responsibilities"
            content="You agree not to misuse the website, attempt unauthorized access, interfere with system operations, or violate any applicable laws or regulations."
          />

          <Section
            title="4. Intellectual Property"
            content="All content including text, graphics, logos, software, and design elements are the exclusive property of AiGENThix and protected under intellectual property laws."
          />

          <Section
            title="5. Confidentiality"
            content="Any confidential information shared through consultation or communication will be handled with strict confidentiality and may be protected under NDA agreements."
          />

          <Section
            title="6. Limitation of Liability"
            content="AiGENThix shall not be liable for indirect, incidental, or consequential damages arising from the use of this website or services."
          />

          <Section
            title="7. Indemnification"
            content="You agree to indemnify and hold harmless AiGENThix from any claims, damages, or legal fees arising from misuse of the website or violation of these terms."
          />

          <Section
            title="8. Governing Law"
            content="These Terms shall be governed by and interpreted in accordance with the laws of India."
          />

          <Section
            title="9. Modifications"
            content="We reserve the right to update these Terms at any time. Continued usage after modifications constitutes acceptance."
          />

        </div>
      </div>
    </>
  );
};

const Section = ({ title, content }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3">
      {title}
    </h2>
    <p className="text-gray-600 leading-relaxed">
      {content}
    </p>
  </div>
);

export default TermsOfUse;
