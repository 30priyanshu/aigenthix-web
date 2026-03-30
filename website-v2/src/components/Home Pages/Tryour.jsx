import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";

/* ===== keep your constants & imports exactly as before ===== */
const MAIN_FONT = "'Playfair Display', Georgia, serif";
const BODY_FONT = "Georgia, serif";
const NAVY_BLUE = "#001f6b"; // New color
const TEAL_COLOR = '#008080';
const GOLD_COLOR = '#D4AF37';

// Products Section Imports (keep same filenames/paths)
import sahayakAiImg from '../IMAGES/Products page images/sahayak ai.webp';
import videoTranslationImg from '../IMAGES/Products page images/video translation.webp';
import aiInterviewerImg from '../IMAGES/Products page images/ai interviewer.webp';
import projectManagementImg from '../IMAGES/Products page images/project.webp';

// Ethics Section Imports
import ethicalaiImg from '../IMAGES/Home Page images/Innovation with Ethics images/ethicalai.webp';
import explainableaiImg from '../IMAGES/Home Page images/Innovation with Ethics images/explainaleai.webp';
import sustainableaiImg from '../IMAGES/Home Page images/Innovation with Ethics images/sustainableai.webp';
import responsibleaiImg from '../IMAGES/Home Page images/Innovation with Ethics images/responsibleai.webp';

const productsData = [
  {
    name: "Sahayak AI",
    description: "An intelligent virtual assistant designed for comprehensive data retrieval and workflow automation across enterprise systems.",
    imagePath: sahayakAiImg,
    tag: "#Productivity",
    route: "/products/sahayak-ai"
  },
  {
    name: "Video Translation",
    description: "Real-time, AI-driven video content translation and localization services, enabling global accessibility with natural voice synthesis.",
    imagePath: videoTranslationImg,
    tag: "#GlobalReach",
    route: "/products/video-translation"
  },
  {
    name: "AI Interviewer",
    description: "Automated pre-screening and candidate evaluation tool that conducts interviews using natural language processing to assess skills and fit.",
    imagePath: aiInterviewerImg,
    tag: "#Recruitment",
    route: "/products/ai-interviewer"
  },
  {
    name: "Project Management Tool",
    description: "AI-powered scheduling, resource allocation, and risk prediction for project managers, ensuring projects stay on time and budget.",
    imagePath: projectManagementImg,
    tag: "#Operations",
    route: "/products/project-management"
  },
];


const ethicsData = [
  {
    title: "Ethical AI",
    description: "We are committed to developing AI solutions that are fair, unbiased, and aligned with human values.",
    imagePath: ethicalaiImg
  },
  {
    title: "Responsible AI",
    description: "We prioritize the responsible use of AI, ensuring transparency and accountability in our work.",
    imagePath: responsibleaiImg
  },
  {
    title: "Sustainable AI",
    description: "Our goal is to build cutting-edge AI solutions that contribute to a sustainable, scalable and equitable future for all.",
    imagePath: sustainableaiImg
  },
  {
    title: "Explainable AI",
    description: "We ensure AI decisions are clear, justifiable, and easy to understand.",
    imagePath: explainableaiImg
  },
];

/* ===== animations + responsive CSS injection (scoped classes) ===== */
const styleSheet = `
/* keyframes */
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
@keyframes slideInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: translateY(0);} }
@keyframes scrollText { 0% { transform: translateX(100%);} 100% { transform: translateX(-100%);} }
@keyframes typing { 0% { width: 0; } 100% { width: 100%; } }
@keyframes blink { 0%,49% { border-right-color: rgba(0,128,128,0.8);} 50%,100% { border-right-color: transparent; } }

/* container */
.aigen-container { padding: 80px 20px; font-family: ${MAIN_FONT}; box-sizing: border-box; }

/* welcome */
.aigen-welcome { overflow: hidden; margin-bottom: 20px; }
.aigen-welcome h1 { font-size: 45px; color: ${TEAL_COLOR}; white-space: nowrap; animation: scrollText 30s linear infinite; }

/* headings */
.aigen-main-title { font-size: 48px; color: #333; margin-bottom: 60px; text-align: center; font-weight: 700; animation: fadeIn 1s ease-out .3s forwards; }
.aigen-ethics-title { font-size: clamp(24px, 4vw, 38px); color: #1a1a1a; margin-bottom: 60px; text-align: center; font-weight: 700; animation: fadeIn 1s ease-out 1s forwards; }

/* desktop products grid – 4 cards in one row */
.aigen-products-grid {
  display: grid;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto 80px;
  grid-template-columns: repeat(4, 1fr);
}

/* bottom grid NOT REQUIRED for products */
.aigen-products-grid--bottom {
  display: none;
}


.aigen-ethics-grid { display: grid; gap: 30px; max-width: 1300px; margin: 0 auto; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }

/* card base (shared) */
.aigen-card { 
  background: #fff; 
  border-radius: 16px; 
  border: 1px solid rgba(0,128,128,0.1); 
  box-shadow: 0 10px 30px rgba(0,0,0,0.08); 
  overflow: hidden; 
  display: flex; 
  flex-direction: column; 
  height: 100%;              /* IMPORTANT */
  transition: all .4s ease; 
  position: relative; 
  animation: slideInUp .8s ease-out forwards; 
}


/* img area */
.aigen-img-area { height: 200px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
.aigen-img-area img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease, opacity .5s ease; opacity: .95; }

/* content */
.aigen-card-content { padding: 24px; display:flex; flex-direction: column; gap: 10px; background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);flex: 1;  }
.aigen-tag { font-size: 12px; font-weight: 600; color: ${TEAL_COLOR}; text-transform: uppercase; letter-spacing: .5px; font-family: ${BODY_FONT}; }
.aigen-title { font-size: 20px; font-weight: 700; color: #1a1a1a; font-family: ${MAIN_FONT}; line-height: 1.3; }
.aigen-desc {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  font-family: ${BODY_FONT};
  min-height: 88px;
}


/* link */
.aigen-link { color: ${TEAL_COLOR}; font-weight: 600; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all .3s ease; margin-top: auto; }
.aigen-link:hover { color: ${GOLD_COLOR}; transform: translateX(4px); }

/* mobile carousel styles */
@media (max-width: 768px) {
  .aigen-container { 
    padding: 40px 16px; 
    background: white; /* Ensure white background on mobile */
  }
  
  .aigen-main-title { 
    font-size: 32px; 
    margin-bottom: 40px; 
  }
  
  .aigen-ethics-title { 
    font-size: 28px; 
    margin-bottom: 40px; 
  }
  
  .aigen-products-grid, .aigen-ethics-grid, .aigen-products-grid--bottom { 
    display: block; 
    max-width: 100%; 
  }
  
  /* Professional carousel container */
  .aigen-carousel-container { 
    position: relative; 
    width: 100%; 
    max-width: 420px; 
    margin: 0 auto;
    background: white; /* White background for carousel container */
  }
  
  .aigen-carousel-viewport { 
    position: relative; 
    overflow: hidden; 
    width: 100%;
    border-radius: 16px;
    background: white; /* White background for viewport */
  }
  
  .aigen-carousel-track { 
    display: flex; 
    transition: transform .4s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
    will-change: transform; 
  }
  
  .aigen-carousel-slide { 
    min-width: 100%; 
    box-sizing: border-box; 
    padding: 0 8px;
    display: flex;
    justify-content: center;
    background: white; /* White background for slides */
  }
  
  .aigen-card {
    height: 460px;
    max-width: 360px;
    width: 100%;
    margin: 0;
    background: white; /* Ensure card background is white */
  }
  
  /* Professional WHITE arrow buttons with BLACK icons */
  .aigen-arrow { 
    position: absolute; 
    top: 50%; 
    transform: translateY(-50%); 
    background: white; /* White background */
    color: #000; /* Black color for arrows */
    border: 2px solid #e5e7eb; /* Light gray border */
    width: 48px; 
    height: 48px; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 24px; 
    font-weight: bold;
    cursor: pointer; 
    z-index: 10; 
    box-shadow: 0 4px 20px rgba(0,0,0,0.15); /* Subtle shadow */
    transition: all 0.3s ease;
  }
  
  .aigen-arrow:hover {
    background: #f8f9fa; /* Slightly darker on hover */
    border-color: #d1d5db; /* Darker border on hover */
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 25px rgba(0,0,0,0.2);
  }
  
  .aigen-arrow:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  .aigen-arrow--left { left: -24px; }
  .aigen-arrow--right { right: -24px; }
  
  /* Hide arrows on very small screens when not needed */
  @media (max-width: 480px) {
    .aigen-carousel-container {
      max-width: 100%;
    }
    
    .aigen-arrow {
      width: 42px;
      height: 42px;
      font-size: 20px;
    }
    
    .aigen-arrow--left { left: -16px; }
    .aigen-arrow--right { right: -16px; }
    
    .aigen-card {
      height: 440px;
      max-width: 340px;
    }
  }
  
  /* Dot indicators */
  .aigen-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
    background: white; /* White background for dots container */
  }
  
  .aigen-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
  }
  
  .aigen-dot.active {
    background: ${TEAL_COLOR};
    transform: scale(1.2);
  }
}

/* Tablet styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .aigen-products-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
  }
  
  .aigen-products-grid--bottom {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  
  .aigen-card {
    height: 460px;
    max-width: 360px;
  }
}
`;

/* inject styles once */
if (typeof document !== 'undefined' && !document.getElementById('aigen-styles')) {
  const s = document.createElement('style');
  s.id = 'aigen-styles';
  s.textContent = styleSheet;
  document.head.appendChild(s);
}

/* ===== Card components (content unchanged) ===== */

const ProductCard = ({ product }) => {
  return (
    <div className="aigen-card" role="article" aria-label={product.name}>
      <div className="aigen-img-area">
        <img src={product.imagePath} alt={product.name} />
      </div>
      <div className="aigen-card-content">
        <span className="aigen-tag">{product.tag}</span>
        <h3 className="aigen-title">{product.name}</h3>
        <p className="aigen-desc">{product.description}</p>
        <Link to={product.route} className="aigen-link">
  View Details <span aria-hidden="true">→</span>
</Link>

      </div>
    </div>
  );
};

const EthicsCard = ({ ethics }) => {
  return (
    <div className="aigen-card" role="article" aria-label={ethics.title}>
      <div className="aigen-img-area" style={{ height: 240 }}>
        <img src={ethics.imagePath} alt={ethics.title} />
      </div>
      <div className="aigen-card-content" style={{ alignItems: 'center', textAlign: 'center' }}>
        <h3 className="aigen-title" style={{ color: TEAL_COLOR, fontSize: 22 }}>{ethics.title}</h3>
        <p className="aigen-desc" style={{ color: '#333' }}>{ethics.description}</p>
      </div>
    </div>
  );
};

/* Dot Indicators Component */
const DotIndicators = ({ count, activeIndex, onClick }) => {
  return (
    <div className="aigen-dots">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          className={`aigen-dot ${index === activeIndex ? 'active' : ''}`}
          onClick={() => onClick(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

/* ===== Main Component with enhanced mobile carousel logic ===== */
const TryOur = () => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' ? window.innerWidth <= 1024 && window.innerWidth > 768 : false);

  /* product carousel state */
  const [pIndex, setPIndex] = useState(0);
  const pTrackRef = useRef(null);

  /* ethics carousel state */
  const [eIndex, setEIndex] = useState(0);
  const eTrackRef = useRef(null);

  /* responsive listener */
  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* sync slide transform on index change */
  useEffect(() => {
    if (isMobile && pTrackRef.current) {
      pTrackRef.current.style.transform = `translateX(-${pIndex * 100}%)`;
    } else if (pTrackRef.current) {
      pTrackRef.current.style.transform = `translateX(0%)`;
    }
  }, [pIndex, isMobile]);

  useEffect(() => {
    if (isMobile && eTrackRef.current) {
      eTrackRef.current.style.transform = `translateX(-${eIndex * 100}%)`;
    } else if (eTrackRef.current) {
      eTrackRef.current.style.transform = `translateX(0%)`;
    }
  }, [eIndex, isMobile]);

  /* carousel navigation */
  const next = (type) => {
    if (type === 'product') setPIndex((s) => (s + 1) % productsData.length);
    else setEIndex((s) => (s + 1) % ethicsData.length);
  };
  
  const prev = (type) => {
    if (type === 'product') setPIndex((s) => (s - 1 + productsData.length) % productsData.length);
    else setEIndex((s) => (s - 1 + ethicsData.length) % ethicsData.length);
  };

  /* Auto-advance carousel */
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      setPIndex((s) => (s + 1) % productsData.length);
      setEIndex((s) => (s + 1) % ethicsData.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isMobile]);

  /* Touch/drag support */
  useEffect(() => {
    if (!isMobile) return;
    
    const pTrack = pTrackRef.current;
    const eTrack = eTrackRef.current;
    if (!pTrack || !eTrack) return;

    let pStart = 0, eStart = 0, pDragging = false, eDragging = false;

    const pStartHandler = (ev) => { 
      pDragging = true; 
      pStart = ev.touches ? ev.touches[0].clientX : ev.clientX; 
      pTrack.style.transition = 'none'; 
    };
    
    const pMoveHandler = (ev) => {
      if (!pDragging) return;
      const x = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const diff = x - pStart;
      pTrack.style.transform = `translateX(calc(-${pIndex * 100}% + ${diff}px))`;
    };
    
    const pEndHandler = (ev) => {
      pDragging = false; 
      pTrack.style.transition = '';
      const endX = ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX;
      const moved = endX - pStart;
      if (moved < -60) setPIndex((s) => Math.min(s + 1, productsData.length - 1));
      else if (moved > 60) setPIndex((s) => Math.max(s - 1, 0));
      else pTrack.style.transform = `translateX(-${pIndex * 100}%)`;
    };

    const eStartHandler = (ev) => { 
      eDragging = true; 
      eStart = ev.touches ? ev.touches[0].clientX : ev.clientX; 
      eTrack.style.transition = 'none'; 
    };
    
    const eMoveHandler = (ev) => {
      if (!eDragging) return;
      const x = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const diff = x - eStart;
      eTrack.style.transform = `translateX(calc(-${eIndex * 100}% + ${diff}px))`;
    };
    
    const eEndHandler = (ev) => {
      eDragging = false; 
      eTrack.style.transition = '';
      const endX = ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX;
      const moved = endX - eStart;
      if (moved < -60) setEIndex((s) => Math.min(s + 1, ethicsData.length - 1));
      else if (moved > 60) setEIndex((s) => Math.max(s - 1, 0));
      else eTrack.style.transform = `translateX(-${eIndex * 100}%)`;
    };

    /* Add event listeners */
    pTrack.addEventListener('touchstart', pStartHandler, { passive: true });
    pTrack.addEventListener('touchmove', pMoveHandler, { passive: true });
    pTrack.addEventListener('touchend', pEndHandler);
    pTrack.addEventListener('mousedown', pStartHandler);
    pTrack.addEventListener('mousemove', pMoveHandler);
    pTrack.addEventListener('mouseup', pEndHandler);
    pTrack.addEventListener('mouseleave', pEndHandler);

    eTrack.addEventListener('touchstart', eStartHandler, { passive: true });
    eTrack.addEventListener('touchmove', eMoveHandler, { passive: true });
    eTrack.addEventListener('touchend', eEndHandler);
    eTrack.addEventListener('mousedown', eStartHandler);
    eTrack.addEventListener('mousemove', eMoveHandler);
    eTrack.addEventListener('mouseup', eEndHandler);
    eTrack.addEventListener('mouseleave', eEndHandler);

    return () => {
      /* Cleanup */
      pTrack.removeEventListener('touchstart', pStartHandler);
      pTrack.removeEventListener('touchmove', pMoveHandler);
      pTrack.removeEventListener('touchend', pEndHandler);
      pTrack.removeEventListener('mousedown', pStartHandler);
      pTrack.removeEventListener('mousemove', pMoveHandler);
      pTrack.removeEventListener('mouseup', pEndHandler);
      pTrack.removeEventListener('mouseleave', pEndHandler);

      eTrack.removeEventListener('touchstart', eStartHandler);
      eTrack.removeEventListener('touchmove', eMoveHandler);
      eTrack.removeEventListener('touchend', eEndHandler);
      eTrack.removeEventListener('mousedown', eStartHandler);
      eTrack.removeEventListener('mousemove', eMoveHandler);
      eTrack.removeEventListener('mouseup', eEndHandler);
      eTrack.removeEventListener('mouseleave', eEndHandler);
    };
  }, [isMobile, pIndex, eIndex]);

  return (
    <div className="aigen-container">
      <h2 className="aigen-main-title">Try Our Exclusive AI Products</h2>

     
{/* Desktop / Tablet */}
{!isMobile && (
  <div className="aigen-products-grid">
    {productsData.map((p, i) => (
      <ProductCard key={i} product={p} />
    ))}
  </div>
)}

{/* Mobile */}
{isMobile && (
  <div className="aigen-carousel-container">
    <div className="aigen-carousel-viewport">
      <div className="aigen-carousel-track" ref={pTrackRef}>
        {productsData.map((p, i) => (
          <div key={i} className="aigen-carousel-slide">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>

    <button className="aigen-arrow aigen-arrow--left" onClick={() => prev('product')}>‹</button>
    <button className="aigen-arrow aigen-arrow--right" onClick={() => next('product')}>›</button>

    <DotIndicators
      count={productsData.length}
      activeIndex={pIndex}
      onClick={setPIndex}
    />
  </div>
)}
      {/* Ethics */}
      <div style={{ marginTop: 40 }}>
        <h2 className="aigen-ethics-title">The Difference: Innovation with Ethics</h2>

        {!isMobile && (
          <div className="aigen-ethics-grid">
            {ethicsData.map((e, i) => <EthicsCard key={i} ethics={e} />)}
          </div>
        )}

        {isMobile && (
          <div className="aigen-carousel-container">
            <div className="aigen-carousel-viewport" aria-roledescription="carousel" aria-label="Ethics carousel">
              <div className="aigen-carousel-track" ref={eTrackRef}>
                {ethicsData.map((e, i) => (
                  <div key={i} className="aigen-carousel-slide">
                    <EthicsCard ethics={e} />
                  </div>
                ))}
              </div>
            </div>

            <button className="aigen-arrow aigen-arrow--left" onClick={() => prev('ethics')} aria-label="Previous ethics">‹</button>
            <button className="aigen-arrow aigen-arrow--right" onClick={() => next('ethics')} aria-label="Next ethics">›</button>
            
            <DotIndicators 
              count={ethicsData.length} 
              activeIndex={eIndex} 
              onClick={setEIndex}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TryOur;