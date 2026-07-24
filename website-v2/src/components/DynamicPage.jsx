import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cmsService } from '../services/cmsService';
import SEO from './SEO';
import LiteYouTube from "./LiteYouTube";
import { FaFileAlt, FaBrain, FaCamera, FaChartBar, FaBullseye, FaChalkboardTeacher, FaCheckCircle } from 'react-icons/fa';

const iconMap = {
  FaFileAlt: <FaFileAlt className="text-xl text-gray-700 mt-1 shrink-0" />,
  FaBrain: <FaBrain className="text-xl text-gray-700 mt-1 shrink-0" />,
  FaCamera: <FaCamera className="text-xl text-gray-700 mt-1 shrink-0" />,
  FaChartBar: <FaChartBar className="text-xl text-gray-700 mt-1 shrink-0" />,
  FaBullseye: <FaBullseye className="text-xl text-gray-700 mt-1 shrink-0" />,
  FaChalkboardTeacher: <FaChalkboardTeacher className="text-xl text-gray-700 mt-1 shrink-0" />,
  FaCheckCircle: <FaCheckCircle className="text-xl text-gray-700 mt-1 shrink-0" />
};

const parseCommaList = (text) => {
    if (!text) return [];
    if (Array.isArray(text)) return text;
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed;
    } catch(e) {}
    return text.split(',').map(i => i.trim()).filter(i => i);
};

const parseFeatures = (text) => {
    if (!text) return [];
    if (Array.isArray(text)) return text;
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed;
    } catch(e) {}
    
    return text.split(',').map(item => {
        const parts = item.split(':');
        return {
            title: parts[0] ? parts[0].trim() : '',
            desc: parts[1] ? parts.slice(1).join(':').trim() : ''
        }
    }).filter(i => i.title);
};

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const ProductTemplate = ({ data }) => {
    const title = data.title;
    const description = data.description;
    const heroImg = data.hero_image_url || data.image_url;
    const features = parseFeatures(data.features);
    const demoVideo = data.demo_video_url;
    const demoDescription = data.demo_description || `Watch how ${title} helps you achieve your goals.`;
    const highlights = parseCommaList(data.highlights);

    return (
      <div className="min-h-screen bg-gray-50" style={{ marginTop: '80px' }}>
        <section className="relative overflow-hidden">
          <div className="h-60 sm:h-72 md:h-96 w-full relative overflow-hidden">
            {heroImg && <img src={heroImg} alt={title} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="max-w-6xl mx-auto -mt-20 sm:-mt-24 relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 space-y-12">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{title}</h1>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{description}</p>
              </div>

              {features.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-6">Platform Capabilities</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((item, index) => (
                      <div key={index} className="bg-gray-50 border rounded-xl p-6 hover:shadow-lg transition duration-300">
                        <div className="flex items-start gap-4">
                          <FaCheckCircle className="text-xl text-[#2D4DE8] mt-1 shrink-0" />
                          <div>
                            <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {demoVideo && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Platform Demo</h2>
                  <p className="text-gray-600 mb-6">{demoDescription}</p>
                  <div className="relative rounded-xl overflow-hidden shadow-lg border aspect-video">
                    <LiteYouTube src={demoVideo} title={`${title} Demo`} />
                  </div>
                </div>
              )}

              {highlights.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">Why Choose {title}?</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm sm:text-base">
                    {highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link to="/contact" className="inline-block bg-[#2D4DE8] hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow w-full sm:w-auto text-center">
                  Try for Free
                </Link>
                <Link to="/products" className="text-[#2D4DE8] font-medium hover:underline">
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
};

const ServiceTemplate = ({ data }) => {
    const title = data.title;
    const description = data.description;
    const features = parseFeatures(data.benefits);
    
    const strategyTags = parseCommaList(data.strategy_tags);
    const businessTags = parseCommaList(data.business_tags);

    return (
        <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800" style={{ paddingTop: '80px' }}>
            {/* HERO */}
            <section className="relative py-20 lg:py-32 about-hero bg-[#0B2847] text-white">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 className="text-5xl lg:text-7xl font-black mb-6" variants={fadeUp} initial="hidden" whileInView="visible">
                        {title}
                    </motion.h1>
                    <motion.p className="text-xl lg:text-2xl italic max-w-4xl mx-auto leading-relaxed text-gray-300" variants={fadeUp} initial="hidden" whileInView="visible">
                        {description}
                    </motion.p>
                </div>
            </section>

            {/* FEATURES */}
            {features.length > 0 && (
                <section className="py-20 bg-white text-center">
                    <motion.h2 className="text-3xl font-bold text-gray-900 mb-12" variants={fadeUp} initial="hidden" whileInView="visible">
                        Our Expertise
                    </motion.h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                        {features.map((f, i) => (
                            <motion.div key={i} className="bg-[#f8f9ff] p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300" variants={fadeUp} initial="hidden" whileInView="visible">
                                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* STRATEGY */}
            {data.strategy_title && (
                <section className="flex flex-wrap items-center justify-between max-w-6xl mx-auto py-20 px-10 gap-10">
                    {data.strategy_image_url && (
                        <motion.div className="flex-1 min-w-[320px]" variants={fadeUp} initial="hidden" whileInView="visible">
                            <img src={data.strategy_image_url} alt="Strategy" className="w-full h-[300px] object-cover rounded-xl shadow-lg" />
                        </motion.div>
                    )}
                    <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
                        <h3 className="text-2xl font-bold mb-4">{data.strategy_title}</h3>
                        <p className="text-gray-600 mb-6">{data.strategy_description}</p>
                        <div className="flex flex-wrap gap-3">
                            {strategyTags.map((t, i) => (
                                <span key={i} className="bg-[#e9edff] text-[#2D4DE8] px-4 py-2 rounded-full text-sm font-medium">{t}</span>
                            ))}
                        </div>
                    </motion.div>
                </section>
            )}

            {/* BUSINESS */}
            {data.business_title && (
                <section className="flex flex-wrap items-center justify-between max-w-6xl mx-auto py-20 px-10 gap-10">
                    <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
                        <h3 className="text-2xl font-bold mb-4">{data.business_title}</h3>
                        <p className="text-gray-600 mb-6">{data.business_description}</p>
                        <div className="flex flex-wrap gap-3">
                            {businessTags.map((t, i) => (
                                <span key={i} className="bg-[#e9edff] text-[#2D4DE8] px-4 py-2 rounded-full text-sm font-medium">{t}</span>
                            ))}
                        </div>
                    </motion.div>
                    {data.business_image_url && (
                        <motion.div className="flex-1 min-w-[320px]" variants={fadeUp} initial="hidden" whileInView="visible">
                            <img src={data.business_image_url} alt="Business" className="w-full h-[300px] object-cover rounded-xl shadow-lg" />
                        </motion.div>
                    )}
                </section>
            )}

            {/* CTA */}
            <section className="bg-[#2D4DE8] text-white text-center py-16 px-6">
                <motion.h2 className="text-3xl font-bold mb-4" variants={fadeUp} initial="hidden" whileInView="visible">
                    {data.cta_title || 'Ready to Transform?'}
                </motion.h2>
                <motion.p className="max-w-2xl mx-auto mb-8 text-gray-200" variants={fadeUp} initial="hidden" whileInView="visible">
                    {data.cta_description || 'Let our experts help you design systems that create real impact.'}
                </motion.p>
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
                    <Link to={data.cta_url || "/contact"} className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
                        {data.cta_text || 'Speak to Our Experts'}
                    </Link>
                </motion.div>
            </section>
        </div>
    );
};

const IndustryTemplate = ({ data }) => {
    const title = data.name || data.title;
    const description = data.description;
    const capabilities = parseFeatures(data.capabilities);

    return (
        <div className="font-inter bg-gradient-to-b from-white to-[#f8faff] text-gray-800" style={{ paddingTop: '80px' }}>
            <section className="relative py-20 lg:py-32 text-center bg-[#0B2847] text-white">
                <div className="relative max-w-7xl mx-auto px-6">
                    <motion.h1 className="text-5xl lg:text-7xl font-black mb-6" variants={fadeUp} initial="hidden" whileInView="visible">
                        {title}
                    </motion.h1>
                    <motion.p className="text-xl lg:text-2xl italic max-w-4xl mx-auto text-gray-300" variants={fadeUp} initial="hidden" whileInView="visible">
                        {description}
                    </motion.p>
                </div>
            </section>

            {capabilities.length > 0 && (
                <section className="py-20 bg-white text-center">
                    <h2 className="text-3xl font-bold mb-12">Capabilities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                        {capabilities.map((f, i) => (
                            <div key={i} className="bg-[#f8f9ff] p-8 rounded-xl border shadow-sm">
                                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-600 text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.strategy_title && (
                <section className="flex flex-wrap items-center max-w-6xl mx-auto py-20 px-10 gap-10">
                    {data.strategy_image_url && (
                        <motion.img src={data.strategy_image_url} className="flex-1 min-w-[320px] rounded-xl shadow-lg object-cover h-[300px]" variants={fadeUp} initial="hidden" whileInView="visible" />
                    )}
                    <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible">
                        <h3 className="text-2xl font-bold mb-4">{data.strategy_title}</h3>
                        <p className="text-gray-600 mb-4 whitespace-pre-line">{data.strategy_description}</p>
                    </motion.div>
                </section>
            )}

            <section className="bg-[#2D4DE8] text-white text-center py-16">
                <h2 className="text-3xl font-bold mb-4">{data.cta_title || `Power Your ${title} Growth`}</h2>
                <p className="max-w-2xl mx-auto mb-8 text-gray-200">
                    {data.cta_description || 'Transform operations with intelligent, secure, and scalable solutions.'}
                </p>
                <Link to={data.cta_url || "/contact"} className="bg-white text-[#2D4DE8] px-8 py-3 rounded-lg font-semibold inline-block">
                    {data.cta_text || 'Speak With Experts'}
                </Link>
            </section>
        </div>
    );
};

const DynamicPage = ({ type }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let items = [];
        if (type === 'products') items = await cmsService.getProducts();
        if (type === 'services') items = await cmsService.getServices();
        if (type === 'industries') items = await cmsService.getIndustries();
        if (type === 'rd') items = await cmsService.getRDs();

        const match = items.find(i => i.slug === slug);
        if (match && (match.status === 'published' || match.is_published)) {
          if (typeof match.content_data === 'string') {
             try { match.content_data = JSON.parse(match.content_data); } catch(e) {}
          }
          setData(match);
        } else {
          navigate('/404', { replace: true });
        }
      } catch (error) {
        console.error(`Error loading ${type}`, error);
        navigate('/404', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, type, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2D4DE8]" />
      </div>
    );
  }

  if (!data) return null;

  const title = data.title || data.name || data.project_name;
  const description = data.description || data.summary;
  const imageUrl = data.image_url || data.icon_url || data.hero_image_url;

  return (
    <>
      <SEO
        title={`${title} - AiGENThix`}
        description={description}
        url={`/${type}/${slug}`}
        image={imageUrl}
      />
      {type === 'products' && <ProductTemplate data={data} />}
      {type === 'services' && <ServiceTemplate data={data} />}
      {type === 'industries' && <IndustryTemplate data={data} />}
      {type === 'rd' && <IndustryTemplate data={{...data, name: data.project_name, description: data.summary, capabilities: data.details}} />}
    </>
  );
};

export default DynamicPage;
