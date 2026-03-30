import React from "react";
import SEO from "../components/SEO";

const PrivacyPolicy = () => {

  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    url: "https://www.aigenthix.com/privacy-policy"
  };

  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Understand how AiGENThix collects, uses, stores, and protects your data in compliance with data protection standards."
        url="/privacy-policy"
        schema={[privacySchema]}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10">

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last Updated: 2026
          </p>

          <Section
            title="1. Information We Collect"
            content="We collect personal information such as name, email, company details, phone number, and business inquiries submitted through forms."
          />

          <Section
            title="2. How We Use Information"
            content="Your information is used to provide services, respond to inquiries, improve offerings, and enhance user experience."
          />

          <Section
            title="3. Data Security"
            content="We implement industry-standard security measures including encryption, secure servers, and access controls to protect your information."
          />

          <Section
            title="4. Cookies & Tracking"
            content="We may use cookies and analytics tools to enhance website functionality and monitor performance."
          />

          <Section
            title="5. Third-Party Services"
            content="We may engage trusted service providers for hosting, analytics, or communication. These providers are obligated to protect your data."
          />

          <Section
            title="6. Data Retention"
            content="We retain personal data only as long as necessary for legitimate business purposes or legal compliance."
          />

          <Section
            title="7. Your Rights"
            content="You may request access, correction, or deletion of your personal data by contacting us."
          />

          <Section
            title="8. International Transfers"
            content="If applicable, data may be processed in different jurisdictions while maintaining appropriate safeguards."
          />

          <Section
            title="9. Policy Updates"
            content="We may update this Privacy Policy periodically. Changes will be reflected on this page."
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

export default PrivacyPolicy;
