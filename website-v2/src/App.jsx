import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ScrollToTop from "./components/ScrollToTop";
import './App.css';

import Hero from './components/Home Pages/Hero';
import PremiumHero from './components/Home Pages/PremiumHero';
import Navbar from './components/Navbar';
import TryOur from './components/Home Pages/Tryour';
import TrustedBy from './components/Home Pages/TrustedBy';
import Innovative from './components/Home Pages/innovative';
import ServicesSection from './components/Home Pages/ServicesSection';
import WhyChooseUs from './components/Home Pages/whychooseus';
import Testimonials from './components/Home Pages/Testimonials';
import ContactUs from './components/Home Pages/contactus';
import Blog from './components/Home Pages/blog';
import Faq from './components/Home Pages/faq';
import Footer from './components/Footer';
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import TermsOfUse from "./components/TermsOfUse";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Careers from "./components/Careers";


const AboutUs = lazy(() => import('./components/Nevbar Pages/aboutus'));
const OurPrinciples = lazy(() => import('./components/Nevbar Pages/OurPrinciples'));
const OurTeam = lazy(() => import('./components/Nevbar Pages/ourteam'));
const RND = lazy(() => import('./components/Nevbar Pages/research-development.jsx'));
const Blognevbar = lazy(() => import('./components/Nevbar Pages/Blognevbar'));
const BlogDetails = lazy(() => import('./components/blogcontent Page/BlogDetails'));

const Learning = lazy(() => import('./components/Nevbar Pages/Learning-And-Development.jsx'));
const DataEngineering = lazy(() => import('./components/learning-and-development/data-engineering.jsx'));
const DataAnalytics = lazy(() => import('./components/learning-and-development/data-analytics.jsx'));
const AIML = lazy(() => import('./components/learning-and-development/ai-ml.jsx'));
const GenerativeAI = lazy(() => import('./components/learning-and-development/generative-ai.jsx'));
const MLOps = lazy(() => import('./components/learning-and-development/mlops.jsx'));
const AgenticAI = lazy(() => import('./components/learning-and-development/agentic-ai.jsx'));

const Product = lazy(() => import('./components/Nevbar Pages/Product.jsx'));
const SahayakAI = lazy(() => import('./components/Products Pages/SahayakAI.jsx'));
const AIInterviewer = lazy(() => import('./components/Products Pages/AIInterviewer.jsx'));
const VideoTranslation = lazy(() => import('./components/Products Pages/VideoTranslation.jsx'));
const ProjectManagementTool = lazy(() => import('./components/Products Pages/ProjectManagementTool'));

const SignIn = lazy(() => import('./components/Nevbar Pages/SignIn'));
const CreateAccount = lazy(() => import('./components/Nevbar Pages/CreateAccount'));
const ResetPassword = lazy(() => import('./components/Nevbar Pages/ResetPassword'));
const MyAccount = lazy(() => import('./components/Nevbar Pages/MyAccount'));

const Services = lazy(() => import('./components/Nevbar Pages/Services'));
const AIMLService = lazy(() => import('./components/Services Pages/AIMLService'));
const GenerativeAIService = lazy(() => import('./components/Services Pages/GenerativeAIService'));
const RoboticsService = lazy(() => import('./components/Services Pages/RoboticsService'));
const HumanoidSystems = lazy(() => import('./components/Services Pages/HumanoidSystems'));
const CybersecurityService = lazy(() => import('./components/Services Pages/CybersecurityService'));
const DataEngineeringService = lazy(() => import('./components/Services Pages/DataEngineeringService'));
const BlockchainService = lazy(() => import('./components/Services Pages/BlockchainService'));
const Web3Service = lazy(() => import('./components/Services Pages/Web3Service'));
const SoftwareDevelopmentService = lazy(() => import('./components/Services Pages/SoftwareDevelopmentService'));
const IoTService = lazy(() => import('./components/Services Pages/IoTService'));
const APIIntegrationService = lazy(() => import('./components/Services Pages/APIIntegrationService'));

const Industries = lazy(() => import('./components/Nevbar Pages/Industries'));
const Healthcare = lazy(() => import('./components/industries/Healthcare'));
const Finance = lazy(() => import('./components/industries/Finance'));
const Education = lazy(() => import('./components/industries/Education'));
const Enterprise = lazy(() => import('./components/industries/Enterprise'));
const Manufacturing = lazy(() => import('./components/industries/Manufacturing'));
const RetailEcommerce = lazy(() => import('./components/industries/RetailEcommerce'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ marginTop: '80px' }}>
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <PremiumHero />
              <TrustedBy />
              <TryOur />
              <Innovative />
              <ServicesSection />
              <WhyChooseUs />
              <Testimonials />
              <ContactUs />
              {/* <Blog /> */}
              <Faq />
            </>
          } />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/principles" element={<OurPrinciples />} />
          <Route path="/team" element={<OurTeam />} />

          <Route path="/blog" element={<Blognevbar />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />

          <Route path="/research-development" element={<RND />} />

          <Route path="/learning-and-development" element={<Learning />} />
          <Route path="/learning-and-development/data-engineering" element={<DataEngineering />} />
          <Route path="/learning-and-development/data-analytics" element={<DataAnalytics />} />
          <Route path="/learning-and-development/ai-ml" element={<AIML />} />
          <Route path="/learning-and-development/generative-ai" element={<GenerativeAI />} />
          <Route path="/learning-and-development/mlops" element={<MLOps />} />
          <Route path="/learning-and-development/agentic-ai" element={<AgenticAI />} />

          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/careers" element={<Careers />} />

          <Route
  path="/my-account"
  element={
    <ProtectedRoute>
      <MyAccount />
    </ProtectedRoute>
  }
/>

          <Route path="/industries" element={<Industries />} />
          <Route path="/industries/healthcare" element={<Healthcare />} />
          <Route path="/industries/finance" element={<Finance />} />
          <Route path="/industries/education" element={<Education />} />
          <Route path="/industries/enterprise-solutions" element={<Enterprise />} />
          <Route path="/industries/manufacturing" element={<Manufacturing />} />
          <Route path="/industries/retail-ecommerce" element={<RetailEcommerce />} />

          <Route path="/products" element={<Product />} />
          <Route path="/contact" element={<ContactUs />} />

          <Route path="/services" element={<Services />} />
          <Route path="/services/generative-ai" element={<GenerativeAIService />} />
          <Route path="/services/robotics" element={<RoboticsService />} />
          <Route path="/services/humanoids" element={<HumanoidSystems />} />
          <Route path="/services/cybersecurity" element={<CybersecurityService />} />
          <Route path="/services/ai-ml" element={<AIMLService />} />
          <Route path="/services/data-engineering" element={<DataEngineeringService />} />
          <Route path="/services/web3" element={<Web3Service />} />
          <Route path="/services/blockchain" element={<BlockchainService />} />
          <Route path="/services/software-development" element={<SoftwareDevelopmentService />} />
          <Route path="/services/iot" element={<IoTService />} />
          <Route path="/services/api-integration" element={<APIIntegrationService />} />

          <Route path="/products/sahayak-ai" element={<SahayakAI />} />
          <Route path="/products/video-translation" element={<VideoTranslation />} />
          <Route path="/products/ai-interviewer" element={<AIInterviewer />} />
          <Route path="/products/project-management" element={<ProjectManagementTool />} />

          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ marginTop: '80px' }}>
              <div className="text-center px-6">
                <h1 className="text-8xl font-bold text-gray-200 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg">← Back to Home</Link>
              </div>
            </div>
          } />

          

        </Routes>
      </Suspense>
      <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;