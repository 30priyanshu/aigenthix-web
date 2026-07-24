import React from "react";
import SEO from "../SEO";

const initialProjects = [
  {
    id: "ai-receptionist-1",
    title: "AI Receptionist v1.0",
    subtitle: "Next-Generation AI Receptionist for Events",
    description: "A smart, interactive humanoid assistant designed to engage visitors, answer queries instantly, and elevate the professional experience at conferences, expos, and corporate venues.",
    features: [
      "Instant attendee query handling using AI",
      "Navigation support for halls, sessions & schedules",
      "Professional front-desk presence with humanoid design",
      "Maintain consistent brand identity across all event touchpoints"
    ],
    is3D: true,
    modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
  }
];

const RND = () => {
  const [projectsList, setProjectsList] = React.useState(initialProjects);

  React.useEffect(() => {
    import('../../services/cmsService').then(({ cmsService }) => {
      cmsService.getRDs().then(dyn => {
        const published = dyn.filter(r => r.status === 'published');
        const formatted = published.map(r => ({
          id: `dyn-${r.id}`,
          title: r.project_name || r.title,
          subtitle: r.summary || 'Innovative R&D Project',
          description: r.description || r.details || 'Pushing the boundaries of technology.',
          features: r.features ? r.features.split('\n') : [],
          is3D: false,
          modelSrc: r.image_url
        }));
        
        setProjectsList(prev => {
          const newItems = formatted.filter(n => !prev.some(p => p.title === n.title));
          return [...prev, ...newItems];
        });
      }).catch(err => console.error("Error fetching dynamic R&D", err));
    });
  }, []);

  return (
    <>
      <SEO
        title="Research & Development"
        description="Building intelligent, production-ready AI systems engineered for real-world deployment and enterprise environments."
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-['Poppins',_sans-serif]">

        {/* ================= HERO SECTION (UNCHANGED) ================= */}
        <section className="relative py-16 about-hero">
          <div className="absolute inset-0 hero-overlay" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 pt-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 animate-fadeInDown">
              <span className="text-blue-300 italic">Research & Development</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-4xl mx-auto leading-relaxed mt-4">
              Building intelligent, production-ready AI systems engineered for real-world deployment and enterprise environments.
            </p>
          </div>
        </section>

        {/* ================= PRODUCT SECTION ================= */}
        {projectsList.map((project, index) => (
          <section key={project.id || index} className="max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-16 items-center border-b border-gray-100 last:border-0">

            {/* -------- LEFT CONTENT -------- */}
            <div className={`space-y-8 ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>

              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {project.title}
                </h2>
                <div className="w-20 h-1 bg-blue-600 rounded-full mb-6"></div>
              </div>

             <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-900">
      {project.subtitle}
    </h3>

    <p className="text-lg text-gray-600 leading-relaxed max-w-xl text-justify whitespace-pre-line">
      {project.description}
    </p>
  </div>

              {project.features && project.features.length > 0 && (
                <ul className="space-y-4 text-gray-700 text-base">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <div>
                <button className="mt-6 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  Request Demo
                </button>
              </div>
            </div>

            {/* -------- RIGHT 3D MODEL / IMAGE -------- */}
            <div className={`bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
              {project.is3D ? (
                 <model-viewer
                  src={project.modelSrc}
                  camera-controls
                  auto-rotate
                  style={{ width: "100%", height: "500px" }}
                ></model-viewer>
              ) : (
                <img src={project.modelSrc || 'https://via.placeholder.com/500'} alt={project.title} className="w-full h-[500px] object-cover rounded-2xl" />
              )}
            </div>
          </section>
        ))}

        {/* ================= FOOTER ================= */}
        <section className="bg-white border-t border-gray-200 py-10 text-center">
          <p className="text-gray-500 text-sm tracking-wide">
            © 2026 — AI Receptionist v1.0 | Research & Development Division
          </p>
        </section>

      </div>
    </>
  );
};

export default RND;