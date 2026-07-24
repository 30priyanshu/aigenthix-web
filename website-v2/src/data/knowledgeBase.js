/**
 * AiGENThix Website Knowledge Base
 * Used by the RAG chatbot to answer questions from website content only.
 * Each item: id, source (page), content, keywords.
 */

export const KNOWLEDGE_CHUNKS = [
  // Contact / Brand (from site constants)
  {
    id: 'brand-contact',
    source: '/contact',
    content:
      'AiGENThix contact details: Address: HSR Layout, Bengaluru, Karnataka, India. Email: info@aigenthix.com (primary) and aigenthix@gmail.com (secondary). Phone: +91 9419904765.',
    keywords: [
      'contact',
      'phone',
      'mobile',
      'number',
      'email',
      'mail',
      'address',
      'bengaluru',
      'hsr',
      'info@aigenthix.com',
      '+91',
    ],
  },
  // Company / About
  {
    id: 'about-1',
    source: '/about',
    content:
      'AiGenthix is an AI consulting and solutions company specializing in cutting-edge artificial intelligence applications across multiple industries. We help businesses harness AI to improve efficiency, automation, and decision-making. Our expertise spans healthcare, education, finance, governance, and enterprise AI, offering AI-driven consulting, training, and research & development services.',
    keywords: ['aigenthix', 'company', 'about', 'ai consulting', 'services'],
  },
  {
    id: 'about-2',
    source: '/about',
    content:
      'Our mission is to democratize artificial intelligence by providing accessible, ethical, and transformative AI solutions that empower businesses and enhance human capabilities across all industries.',
    keywords: ['mission', 'democratize', 'ethical', 'ai solutions'],
  },
  {
    id: 'about-3',
    source: '/about',
    content:
      'Our vision is a world where AI seamlessly integrates with human intelligence to solve complex challenges, drive innovation, and create sustainable growth while maintaining the highest ethical standards.',
    keywords: ['vision', 'ethical', 'human intelligence', 'innovation'],
  },
  {
    id: 'about-4',
    source: '/about',
    content:
      'What we do at AiGenthix: AI consulting & strategy development, AI training & workforce upskilling, AI research & development, and custom AI solution development.',
    keywords: ['consulting', 'training', 'r&d', 'custom ai', 'what we do'],
  },
  // FAQ
  {
    id: 'faq-1',
    source: '/',
    content:
      'AiGenthix is an AI consulting and solutions company. We help businesses use AI to improve efficiency, automation, and decision-making across industries such as healthcare, education, finance, governance, and enterprise AI.',
    keywords: ['what is aigenthix', 'company', 'who are you'],
  },
  {
    id: 'faq-2',
    source: '/',
    content:
      'AiGenthix offers three core AI services: AI consulting for strategy and automation, AI training and workforce upskilling through workshops and bootcamps, and AI research & development for custom solutions in NLP, computer vision, and predictive analytics.',
    keywords: ['services', 'ai services', 'consulting', 'training', 'research'],
  },
  {
    id: 'faq-3',
    source: '/',
    content:
      'AiGenthix is different because of our ethical AI approach, industry-specific expertise, comprehensive services (consulting, training, and R&D under one roof), and commitment to social impact.',
    keywords: ['different', 'unique', 'why choose', 'ethical', 'expertise'],
  },
  // Services
  {
    id: 'svc-genai',
    source: '/services/generative-ai',
    content:
      'Our **Generative AI** services include:\n* **Custom AI Chatbots:** Advanced conversational agents powered by LLMs.\n* **Content Generation:** Automated text, reports, and marketing content.\n* **Image Generation:** Creative AI using diffusion-based models.\n* **Voice AI:** Speech synthesis and voice-enabled assistants.\n* **AI Agents:** Autonomous AI agents for task execution.\n* **Enterprise GenAI:** Secure and scalable AI deployments.\n* **Specialized Tech:** LLM Fine-Tuning, Prompt Engineering, RAG Systems, and AI Integration.',
    keywords: ['generative ai', 'chatbot', 'llm', 'rag', 'genai', 'agents', 'fine-tuning'],
  },
  {
    id: 'svc-aiml',
    source: '/services/ai-ml',
    content:
      'Our **AI & Machine Learning** capabilities include:\n* **AI Model Development:** Custom models built for performance and scalability.\n* **Machine Learning:** Supervised and unsupervised ML solutions for business insights.\n* **Computer Vision:** Image and video intelligence using deep learning.\n* **Deep Learning:** Neural networks for complex pattern recognition.\n* **NLP:** Text analytics, chatbots, and natural language understanding.\n* **AI Automation:** Intelligent workflows to improve efficiency.\n* **Lifecycle Management:** Data Engineering, Model Training, MLOps, and AI Integration.',
    keywords: ['ai', 'ml', 'machine learning', 'computer vision', 'nlp', 'deep learning', 'mlops'],
  },
  {
    id: 'svc-robotics',
    source: '/services/robotics',
    content:
      'Our **Robotics** services focus on smart automation:\n* **Industrial Robotics:** Automation for factories and production lines.\n* **Robotic Process Automation (RPA):** Smart automation for repetitive business tasks.\n* **Autonomous Robotics:** Self-navigating robots for logistics and mobility.\n* **Healthcare Robotics:** Supporting medical and patient care.\n* **Warehouse Robotics:** Automation for smart supply chain operations.\n* **Robotics Engineering:** Complete system development including Robot Design and Autonomous Navigation.',
    keywords: ['services', 'robotics', 'automation', 'rpa', 'autonomous', 'industrial'],
  },
  {
    id: 'svc-cybersecurity',
    source: '/services/cybersecurity',
    content:
      '**Cybersecurity** services at AiGenthix:\n* **Threat Detection:** Real-time prevention and response systems.\n* **Secure Architecture:** Building resilient system frameworks.\n* **Penetration Testing:** Vulnerability assessment and security audits.\n* **Zero Trust:** Implementing zero-trust security models.\n* **Compliance:** Managing risk and regulatory standards.',
    keywords: ['services', 'cybersecurity', 'security', 'penetration testing', 'zero trust', 'risk'],
  },
  {
    id: 'svc-dataeng',
    source: '/services/data-engineering',
    content:
      '**Data Engineering** services include:\n* **Data Pipelines:** End-to-end automated ETL processes.\n* **Data Lakes & Warehousing:** Scalable storage solutions.\n* **Real-time Analytics:** Infrastructure for instant data processing.\n* **Cloud Data Migration:** Moving enterprise data securely to the cloud.',
    keywords: ['data engineering', 'data pipeline', 'etl', 'analytics', 'data lake'],
  },
  {
    id: 'svc-software-dev',
    source: '/services/software-development',
    content:
      '**Software Development** at AiGenthix:\n* **Custom Web & Mobile Apps:** Tailored solutions for browsers and smartphones.\n* **SaaS Platforms:** Scalable cloud-based software architectures.\n* **UI/UX Design:** User-centric development for better engagement.\n* **Cloud-native Solutions:** Building for AWS, Azure, and Google Cloud.',
    keywords: ['services', 'software development', 'web app', 'mobile app', 'saas', 'cloud native'],
  },
  {
    id: 'svc-web3',
    source: '/services/web3',
    content:
      '**Web3 & Blockchain** Development:\n* **dApps:** Decentralized application development.\n* **DeFi & NFTs:** Financial and digital asset platforms.\n* **Smart Contracts:** Secure and audited blockchain logic.\n* **Enterprise Blockchain:** Private and consortium ledger solutions.',
    keywords: ['services', 'web3', 'blockchain', 'defi', 'nft', 'dapps', 'smart contracts'],
  },
  // Products
  {
    id: 'prod-sahayak',
    source: '/products/sahayak-ai',
    content:
      '**Sahayak AI** is an AI-powered education platform. Key features include:\n* **AI Content Creation:** Generate worksheets, quizzes, lesson plans, and presentations faster.\n* **Smart Lesson Planning:** Auto-structured plans with objectives and timelines.\n* **Attendance Automation:** Face recognition-based tracking with real-time reports.\n* **Performance Tracking:** Digital gradebooks and progress analytics for student outcomes.\n* **Student Mentorship:** AI-driven academic guidance and intervention support.\n* **Teacher Development:** Personalized professional growth plans.',
    keywords: ['products', 'product', 'sahayak', 'sahayak ai', 'education platform', 'teachers', 'schools', 'attendance'],
  },
  {
    id: 'prod-video',
    source: '/products/video-translation',
    content:
      '**AI Video Translation** converts English videos into Indic languages. Features:\n* **Multilingual Support:** Translation into Hindi, Tamil, and Telugu.\n* **Speech Recognition:** GPU-based Whisper ASR for high accuracy.\n* **Realistic Dubbing:** Neural TTS for natural-sounding AI voices.\n* **Precise Sync:** Frame-accurate audio-video synchronization.\n* **IndicTrans2:** Advanced neural translation models for Indian languages.',
    keywords: ['products', 'product', 'video translation', 'dubbing', 'hindi', 'tamil', 'telugu', 'whisper'],
  },
  {
    id: 'prod-interviewer',
    source: '/products/ai-interviewer',
    content:
      '**AI Interviewer** is an interview prep platform. Capabilities:\n* **Resume Analysis:** ATS scoring, skill extraction, and keyword optimization.\n* **AI Interview Agent:** Conducts realistic interviews with follow-up questions.\n* **Diverse Categories:** HR, Technical, Behavioral, MBA, and Banking interviews.\n* **Voice & Text Modes:** Interaction via both typed and spoken responses.\n* **Performance Reports:** Detailed feedback on strengths and areas for improvement.',
    keywords: ['products', 'product', 'ai interviewer', 'interview prep', 'resume', 'ats'],
  },
  {
    id: 'prod-pm',
    source: '/products/project-management',
    content:
      '**Project Management Tool** is a unified workspace for collaboration:\n* **Kanban Taskboards:** Real-time sync with priorities and drag-and-drop.\n* **Gantt Timelines:** Dependency tracking and project progress visualization.\n* **Data Grid Sheets:** Live multi-user editing for complex project data.\n* **Team Calendar:** Shared deadlines, milestones, and availability tracking.\n* **RBAC:** Role-based access control for secure team management.',
    keywords: ['products', 'product', 'project management', 'kanban', 'gantt', 'collaboration'],
  },
  // Industries
  {
    id: 'ind-healthcare',
    source: '/industries/healthcare',
    content:
      '**Healthcare AI Solutions** by AiGenthix:\n* **Clinical AI:** AI-assisted diagnostics, medical imaging, and prediction systems.\n* **Telemedicine:** Secure virtual consultations and remote monitoring platforms.\n* **EHR Systems:** Interoperable electronic health records with integrated analytics.\n* **HIPAA Security:** Healthcare-grade encryption and data privacy compliance.\n* **AI Assistants:** Virtual assistants for staff and patient engagement.',
    keywords: ['healthcare', 'diagnostics', 'telemedicine', 'ehr', 'hipaa', 'industry'],
  },
  {
    id: 'ind-finance',
    source: '/industries/finance',
    content:
      '**Financial Technology (FinTech)** offerings:\n* **Fraud Detection:** Real-time AI models for detecting suspicious transactions.\n* **Digital Banking:** End-to-end neobank and digital banking platforms.\n* **Risk Management:** Automated credit scoring and financial risk assessment.\n* **Blockchain Payments:** Secure, transparent, and fast payment systems.\n* **RegTech:** Compliance automation for global financial regulations.',
    keywords: ['finance', 'fintech', 'fraud detection', 'banking', 'risk management', 'industry'],
  },
  {
    id: 'ind-education',
    source: '/industries/education',
    content:
      '**Education Technology (EdTech)** solutions:\n* **Learning Platforms:** AI-powered LMS and content delivery systems.\n* **Virtual Classrooms:** Tools for live classes, collaboration, and engagement.\n* **Adaptive Assessments:** Personalized exams and dynamic learning paths.\n* **Student Analytics:** Tracking performance, engagement, and learning outcomes.\n* **AI Tutors:** Smart assistants for 24/7 student guidance.',
    keywords: ['education', 'edtech', 'lms', 'adaptive learning', 'tutors', 'industry'],
  },
  {
    id: 'ind-retail',
    source: '/industries/retail-ecommerce',
    content:
      '**Retail & E-commerce** AI systems:\n* **Hyper-personalization:** AI-driven product recommendations for users.\n* **Dynamic Pricing:** Real-time price optimization based on market trends.\n* **Supply Chain AI:** Demand forecasting and inventory management.\n* **Visual Search:** Image-based product discovery for shoppers.',
    keywords: ['retail', 'ecommerce', 'supply chain', 'pricing', 'personalization', 'industry'],
  },
  {
    id: 'ind-manufacturing',
    source: '/industries/manufacturing',
    content:
      '**Manufacturing Intelligence** solutions:\n* **Predictive Maintenance:** Reducing downtime by predicting machine failures.\n* **Quality Control:** Automated visual inspection using AI computer vision.\n* **Process Optimization:** AI-driven efficiency gains across production lines.\n* **Smart Logistics:** Optimized routing and warehouse automation.',
    keywords: ['manufacturing', 'predictive maintenance', 'quality control', 'industry', 'efficiency'],
  },
  {
    id: 'ind-enterprise',
    source: '/industries/enterprise-solutions',
    content:
      '**Enterprise AI Solutions** focus on:\n* **HR Automation:** AI for recruitment, screening, and employee engagement.\n* **Legal AI:** Document analysis, compliance tracking, and contract review.\n* **Operational Excellence:** Custom AI agents to automate daily business workflows.\n* **Secure Knowledge Bases:** RAG-based systems for expert internal search.',
    keywords: ['enterprise solutions', 'hr', 'legal', 'automation', 'rag', 'industry'],
  },

  // Core Principles
  {
    id: 'principles-overview',
    source: '/principles',
    content:
      'AiGENThix core principles guide every innovation with a foundation built on ethics, responsibility, and human progress.',
    keywords: ['principles', 'core principles', 'values', 'ethics', 'responsibility'],
  },
  {
    id: 'principles-list',
    source: '/principles',
    content:
      'Core principles include Innovation, Trust & Safety, Transparency, AI Literacy, Advocacy, Pioneering Excellence, AI Ethics, and Human-Centered AI.',
    keywords: ['innovation', 'trust', 'safety', 'transparency', 'ai literacy', 'advocacy', 'pioneering', 'ai ethics', 'human-centered'],
  },
  {
    id: 'principle-innovation',
    source: '/principles',
    content:
      'Innovation: bridging AI and human intelligence to create sustainable and impactful solutions.',
    keywords: ['principles', 'innovation'],
  },
  {
    id: 'principle-trust-safety',
    source: '/principles',
    content:
      'Trust & Safety: continuously enhancing AI fairness, security, and ethical implementation.',
    keywords: ['principles', 'trust', 'safety', 'fairness', 'security'],
  },
  {
    id: 'principle-transparency',
    source: '/principles',
    content:
      'Transparency: building AI solutions that are secure and aligned with ethical principles.',
    keywords: ['principles', 'transparency', 'secure', 'ethical'],
  },
  {
    id: 'principle-ai-literacy',
    source: '/principles',
    content:
      'AI Literacy: empowering industries with knowledge to foster responsible AI adoption.',
    keywords: ['principles', 'ai literacy', 'responsible adoption'],
  },
  {
    id: 'principle-advocacy',
    source: '/principles',
    content:
      'Advocacy: raising awareness and shaping AI policies that serve humanity.',
    keywords: ['principles', 'advocacy', 'policy'],
  },
  {
    id: 'principle-pioneering',
    source: '/principles',
    content:
      'Pioneering Excellence: leading the AI revolution with ground-breaking solutions that set AiGENThix apart.',
    keywords: ['principles', 'pioneering excellence', 'leading'],
  },
  {
    id: 'principle-ai-ethics',
    source: '/principles',
    content:
      'AI Ethics: ensuring AI solutions align with ethical guidelines to prevent bias and discrimination.',
    keywords: ['principles', 'ai ethics', 'bias', 'discrimination'],
  },
  {
    id: 'principle-human-centered',
    source: '/principles',
    content:
      'Human-Centered AI: designing AI solutions that enhance human capabilities rather than replace them.',
    keywords: ['principles', 'human-centered', 'human capabilities'],
  },
  // Contact & legal
  {
    id: 'contact',
    source: '/contact',
    content:
      'To contact AiGenthix, you can email info@aigenthix.com or aigenthix@gmail.com, or use the contact form on the website. The company is based in HSR Layout, Bengaluru, Karnataka, India.',
    keywords: ['contact', 'email', 'phone', 'address', 'support'],
  },
  {
    id: 'legal',
    source: '/privacy-policy',
    content:
      'AiGenthix provides Terms of Use and Privacy Policy pages that describe how the website and services may be used and how data is handled.',
    keywords: ['terms', 'privacy', 'policy', 'legal'],
  },
];

