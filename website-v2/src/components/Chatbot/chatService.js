import { KNOWLEDGE_CHUNKS } from '../../data/knowledgeBase';
import { apiClient } from '../../services/api';

// --- Guardrails: blocked patterns (client-side) ---
const BLOCKED_PATTERNS = [
  /hack|exploit|malware|virus|phish/i,
  /illegal|crime|criminal/i,
  /harm|hurt|kill|violence|weapon/i,
  /adult|nsfw|explicit|porn/i,
  /jailbreak|ignore instructions|system prompt/i,
  /pretend you are|act as if you are|you are now/i,
];

const MIN_RELEVANCE = 0.12;
const TOP_K = 6;
const MAX_RESPONSE_WORDS = 500;
const FALLBACK_MAX_WORDS = 120;
const LONG_CONTEXT_CHARS_FOR_COURSES = 900;
const LLM_RATE_LIMIT_COOLDOWN_MS = 60_000;
const LLM_BUSY_COOLDOWN_MS = 30_000;
const GREETING_PATTERN =
  /^(hi|hello|hey|hola|namaste|good morning|good afternoon|good evening)( there)?[!,. ]*$/i;
const AFFIRMATIVE_PATTERN = /\b(yes|yeah|yep|sure|ok|okay|please|go ahead|sounds good|do it|let's do it)\b/i;
const NEGATIVE_PATTERN = /\b(no|nope|nah|not now|don't|do not|skip|nothing else)\b/i;
const ALL_PRODUCTS_PATTERN = /\b(all|all of them|all products|everything|every product)\b/i;
const DETAIL_FOLLOW_UP_PATTERN =
  /\b(more|details|detail|tell me more|tell me more about it|go on|continue|elaborate)\b/i;
const COMPARISON_PATTERN = /\b(compare|comparison|compare them|show comparison)\b/i;
const SELECTION_PATTERN = /\b(first|second|third|fourth|last|first one|second one|third one|fourth one|last one|this one|that one)\b/i;
const INCOMPLETE_TRAILING_WORDS = new Set([
  'about',
  'across',
  'and',
  'as',
  'at',
  'because',
  'for',
  'from',
  'in',
  'include',
  'includes',
  'including',
  'into',
  'of',
  'on',
  'or',
  'our',
  'provides',
  'serves',
  'specializes',
  'such',
  'that',
  'the',
  'their',
  'through',
  'to',
  'with',
]);
const PRODUCT_OPTIONS = [
  {
    name: 'Sahayak AI',
    link: '[Sahayak AI](/products/sahayak-ai)',
    source: '/products/sahayak-ai',
    aliases: ['sahayak ai', 'sahayak'],
    summary: 'Built for education workflows, with AI content creation, lesson planning, attendance automation, and student performance tracking.',
  },
  {
    name: 'AI Interviewer',
    link: '[AI Interviewer](/products/ai-interviewer)',
    source: '/products/ai-interviewer',
    aliases: ['ai interviewer', 'interviewer'],
    summary: 'Focused on interview preparation, with resume analysis, mock interviews, voice or text interaction, and performance feedback.',
  },
  {
    name: 'AI Video Translation',
    link: '[AI Video Translation](/products/video-translation)',
    source: '/products/video-translation',
    aliases: ['ai video translation', 'video translation', 'dubbing'],
    summary: 'Designed for multilingual dubbing, with translation and voice generation for Hindi, Tamil, and Telugu video content.',
  },
  {
    name: 'Project Management Tool',
    link: '[Project Management Tool](/products/project-management)',
    source: '/products/project-management',
    aliases: ['project management tool', 'project management'],
    summary: 'Made for team collaboration, with Kanban boards, Gantt timelines, live sheets, calendars, and role-based access control.',
  },
];
const COURSE_OPTIONS = [
  {
    name: 'Data Engineering',
    link: '[Data Engineering](/learning-and-development/data-engineering)',
    source: '/learning-and-development/data-engineering',
    aliases: ['data engineering'],
    summary: 'Build scalable data pipelines, ETL and ELT workflows, and cloud data architectures.',
  },
  {
    name: 'Data Analytics',
    link: '[Data Analytics](/learning-and-development/data-analytics)',
    source: '/learning-and-development/data-analytics',
    aliases: ['data analytics'],
    summary: 'Learn SQL, BI dashboards, and data storytelling for practical business insights.',
  },
  {
    name: 'AI & Machine Learning',
    link: '[AI & Machine Learning](/learning-and-development/ai-ml)',
    source: '/learning-and-development/ai-ml',
    aliases: ['ai machine learning', 'ai ml', 'machine learning'],
    summary: 'Cover ML fundamentals, model training and evaluation, and real-world AI use cases.',
  },
  {
    name: 'AI & MLOps',
    link: '[AI & MLOps](/learning-and-development/mlops)',
    source: '/learning-and-development/mlops',
    aliases: ['ai mlops', 'mlops'],
    summary: 'Focus on production ML pipelines, monitoring, CI/CD, and scalable deployment.',
  },
  {
    name: 'Generative AI',
    link: '[Generative AI](/learning-and-development/generative-ai)',
    source: '/learning-and-development/generative-ai',
    aliases: ['generative ai', 'genai'],
    summary: 'Learn LLMs, prompt engineering, RAG, and multimodal application development.',
  },
  {
    name: 'Agentic AI',
    link: '[Agentic AI](/learning-and-development/agentic-ai)',
    source: '/learning-and-development/agentic-ai',
    aliases: ['agentic ai'],
    summary: 'Build autonomous agents with planning, memory, tools, and workflow orchestration.',
  },
];

const OUT_OF_SCOPE_MSG =
  "I can help with AiGENThix topics from our website, like services, products, industries, principles, and contact details. What would you like to explore?";

const GUARDRAIL_BLOCK_MSG =
  "I can help with AiGENThix topics like services, products, industries, principles, and contact details. What would you like to know?";

const GREETING_MSG =
  "Hi! I can help with AiGENThix services, products, industries, principles, and contact details. What are you curious about?";

let llmCooldownUntil = 0;

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function scoreTokenMatch(token, candidateToken) {
  if (candidateToken === token) return 1;
  if (token.length < 3 || candidateToken.length < 3) return 0;
  return candidateToken.includes(token) || token.includes(candidateToken) ? 0.5 : 0;
}

function scoreChunk(queryTokens, chunk) {
  const contentTokens = new Set([
    ...tokenize(chunk.content),
    ...(chunk.keywords || []).map((k) => String(k).toLowerCase()),
  ]);

  let matches = 0;
  for (const t of queryTokens) {
    if (contentTokens.has(t)) {
      matches += 1;
    } else {
      for (const ct of contentTokens) {
        const partialScore = scoreTokenMatch(t, ct);
        if (partialScore) {
          matches += partialScore;
          break;
        }
      }
    }
  }
  const score = matches / Math.max(queryTokens.length, 1);
  return Math.min(1, score);
}

const PRODUCT_HINTS = [
  'product',
  'products',
  'pricing',
  'demo',
  'sahayak',
  'interviewer',
  'video translation',
  'project management',
  'kanban',
  'gantt',
  'ats',
  'resume',
  'dubbing',
];

const SERVICE_HINTS = [
  'service',
  'services',
  'generative ai',
  'ai ml',
  'machine learning',
  'robotics',
  'humanoid',
  'cybersecurity',
  'data engineering',
  'software development',
  'api integration',
  'iot',
  'web3',
  'blockchain',
];

const COURSE_HINTS = [
  'courses',
  'available courses',
  'course list',
  'courses offered',
  'training program',
  'training programs',
  'learning and development',
  'learning & development',
  'syllabus',
  'curriculum',
];

const INDUSTRY_HINTS = [
  'industry',
  'industries',
  'healthcare',
  'finance',
  'retail',
  'e-commerce',
  'manufacturing',
  'education',
  'enterprise solutions',
];

const PRINCIPLE_HINTS = [
  'principle',
  'principles',
  'core principle',
  'our core principles',
  'values',
  'trust',
  'safety',
  'transparency',
  'ai literacy',
  'advocacy',
  'ai ethics',
  'human-centered',
  'human centered',
  'pioneering',
  'innovation',
];

const CONTACT_HINTS = ['contact', 'email', 'mail', 'phone', 'mobile', 'number', 'address', 'location'];

const CATALOG_PATTERNS = {
  products: /\b(products|product list|show products|which products|what products)\b/i,
  services: /\b(services|service list|offerings|what services|which services)\b/i,
  industries: /\b(industries|industry list|sectors|domains)\b/i,
  principles: /\b(principles|core principles|values)\b/i,
  courses:
    /\b(available courses?|courses? available|what courses?|which courses?|list courses?|show courses?|courses? offered|training programs?|learning (?:and|&) development|syllabus|curriculum)\b/i,
};

const SOURCE_LABEL_OVERRIDES = {
  '/about': 'About AiGENThix',
  '/contact': 'Contact Page',
  '/principles': 'Our Principles',
};

function detectIntent(q) {
  const s = (q || '').toLowerCase();
  if (COURSE_HINTS.some((h) => s.includes(h))) return 'courses';
  if (PRODUCT_HINTS.some((h) => s.includes(h))) return 'products';
  if (CONTACT_HINTS.some((h) => s.includes(h))) return 'contact';
  if (PRINCIPLE_HINTS.some((h) => s.includes(h))) return 'principles';
  if (INDUSTRY_HINTS.some((h) => s.includes(h))) return 'industries';
  if (SERVICE_HINTS.some((h) => s.includes(h))) return 'services';
  return 'general';
}

function getConversationContextLength(query, history = []) {
  const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
  const historyText = recentHistory.map((message) => String(message?.content || '')).join(' ');
  return `${String(query || '').trim()} ${historyText}`.trim().length;
}

function isCourseCatalogQuery(query) {
  const normalized = String(query || '').toLowerCase().trim();
  if (!normalized) return false;
  if (CATALOG_PATTERNS.courses.test(normalized)) return true;

  const asksForCourseInfo = /\b(course|courses|training|program|syllabus|curriculum)\b/i.test(normalized);
  if (!asksForCourseInfo) return false;

  return COURSE_OPTIONS.some((course) => course.aliases.some((alias) => normalized.includes(alias)));
}

function buildCoursesCatalogAnswer(namesOnly = false) {
  const lines = [
    'AiGENThix currently offers these courses:',
    ...COURSE_OPTIONS.map((course) =>
      namesOnly ? `* ${course.link}` : `* ${course.link} - ${course.summary}`
    ),
  ];

  if (!namesOnly) {
    lines.push('If you want, I can also share details for any specific course.');
  }

  return limitWords(lines.join('\n'), MAX_RESPONSE_WORDS);
}

function buildCourseCatalogReply(query, history = []) {
  if (!isCourseCatalogQuery(query)) return null;

  const contextLength = getConversationContextLength(query, history);
  const namesOnly = contextLength >= LONG_CONTEXT_CHARS_FOR_COURSES;
  return buildCoursesCatalogAnswer(namesOnly);
}

function isGreeting(query) {
  return GREETING_PATTERN.test(String(query || '').trim());
}

function isAmbiguousFollowUp(query) {
  const trimmed = String(query || '').trim();
  return (
    AFFIRMATIVE_PATTERN.test(trimmed) ||
    NEGATIVE_PATTERN.test(trimmed) ||
    ALL_PRODUCTS_PATTERN.test(trimmed) ||
    DETAIL_FOLLOW_UP_PATTERN.test(trimmed) ||
    COMPARISON_PATTERN.test(trimmed) ||
    SELECTION_PATTERN.test(trimmed)
  );
}

function stripMarkdown(text) {
  return String(text || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function joinList(items) {
  const filtered = items.filter(Boolean);
  if (!filtered.length) return '';
  if (filtered.length === 1) return filtered[0];
  if (filtered.length === 2) return `${filtered[0]} and ${filtered[1]}`;
  return `${filtered.slice(0, -1).join(', ')}, and ${filtered[filtered.length - 1]}`;
}

function findReferencedProduct(text) {
  const haystack = stripMarkdown(text).toLowerCase();
  return PRODUCT_OPTIONS.find((product) => product.aliases.some((alias) => haystack.includes(alias))) || null;
}

function findReferencedProducts(text) {
  const haystack = stripMarkdown(text).toLowerCase();
  return PRODUCT_OPTIONS.filter((product) => product.aliases.some((alias) => haystack.includes(alias)));
}

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function getLastMeaningfulWord(text) {
  const words = stripMarkdown(text)
    .toLowerCase()
    .match(/[a-z0-9]+/g);

  return words?.at(-1) || '';
}

function hasTerminalPunctuation(text) {
  return /[.!?]["')\]]*$/.test(String(text || '').trim());
}

function extractCompleteSentences(text) {
  return String(text || '')
    .split('\n')
    .flatMap((line) => {
      const trimmed = line.trim();
      if (!trimmed) return [];

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return [trimmed];
      }

      const matches = trimmed.match(/[^.!?]+[.!?]["')\]]*/g);
      return matches ? matches.map((sentence) => sentence.trim()) : [];
    })
    .filter(Boolean);
}

function ensureTerminalPunctuation(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed || hasTerminalPunctuation(trimmed)) return trimmed;
  return `${trimmed}.`;
}

function limitWords(text, maxWords = MAX_RESPONSE_WORDS) {
  const normalized = String(text || '').trim();
  const words = normalized.split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) return normalized;

  const truncated = words.slice(0, maxWords).join(' ').replace(/[,:;]$/, '');
  const completeSentences = extractCompleteSentences(truncated).join(' ');

  if (countWords(completeSentences) >= 8) {
    return completeSentences;
  }

  return ensureTerminalPunctuation(truncated);
}

function looksIncomplete(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) return true;

  const lastWord = getLastMeaningfulWord(trimmed);
  if (INCOMPLETE_TRAILING_WORDS.has(lastWord)) return true;

  if (trimmed.includes('\n')) {
    const lines = trimmed
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const lastLine = lines.at(-1) || '';
    if (lastLine.startsWith('* ') || lastLine.startsWith('- ')) {
      return INCOMPLETE_TRAILING_WORDS.has(getLastMeaningfulWord(lastLine));
    }
  }

  return !hasTerminalPunctuation(trimmed);
}

function finalizeAnswer(answer, query, chunks) {
  const normalized = String(answer || '').replace(/\s+\n/g, '\n').trim();
  if (!normalized) return buildFallbackAnswer(query, chunks);

  const limited = limitWords(normalized, MAX_RESPONSE_WORDS);
  if (!looksIncomplete(limited)) return limited;

  const completePart = extractCompleteSentences(limited).join(' ').trim();
  if (countWords(completePart) >= 8 && !looksIncomplete(completePart)) {
    return completePart;
  }

  return buildFallbackAnswer(query, chunks);
}

function scoreText(queryTokens, text) {
  const contentTokens = new Set(tokenize(text));
  let matches = 0;

  for (const token of queryTokens) {
    if (contentTokens.has(token)) {
      matches += 1;
      continue;
    }

    for (const candidateToken of contentTokens) {
      const partialScore = scoreTokenMatch(token, candidateToken);
      if (partialScore) {
        matches += partialScore;
        break;
      }
    }
  }

  return matches / Math.max(queryTokens.length, 1);
}

function getChunkTitle(chunk) {
  const emphasized = String(chunk?.content || '').match(/\*\*(.+?)\*\*/);
  if (emphasized?.[1]) return stripMarkdown(emphasized[1]);
  if (SOURCE_LABEL_OVERRIDES[chunk?.source]) return SOURCE_LABEL_OVERRIDES[chunk.source];
  if (chunk?.id === 'faq-1' || chunk?.id?.startsWith('about')) return 'AiGENThix';

  const slug = String(chunk?.source || '')
    .split('/')
    .filter(Boolean)
    .pop();

  if (!slug) return 'AiGENThix';
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getLeadSentence(content) {
  const leadLine = String(content || '')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('*'));

  if (!leadLine) return '';

  const cleanLead = stripMarkdown(leadLine);
  const sentence = cleanLead.split(/(?<=[.!?])\s+/).find(Boolean) || cleanLead;
  const trimmed = sentence.replace(/:\s*$/, '').trim();

  if (/^what we do at aigenthix:/i.test(cleanLead)) {
    return 'AiGENThix works across AI consulting, training, R&D, and custom AI solutions.';
  }

  if (/^our\b/i.test(trimmed) && /\binclude$/i.test(trimmed)) {
    const subject = trimmed
      .replace(/^our\s+/i, '')
      .replace(/\s+include$/i, '')
      .trim();
    return `AiGENThix offers ${subject}.`;
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function getHighlights(content, queryTokens, limit = 3) {
  const bullets = String(content || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('*'))
    .map((line) => {
      const cleanLine = stripMarkdown(line.replace(/^\*\s+/, ''));
      const [title, detail] = cleanLine.split(/:\s+/, 2);
      return {
        label: title?.trim() || cleanLine,
        text: cleanLine,
        detail: detail?.trim() || '',
      };
    });

  if (!bullets.length) return [];

  return bullets
    .map((bullet, index) => ({
      ...bullet,
      score: scoreText(queryTokens, `${bullet.label} ${bullet.detail}`),
      index,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((bullet) => bullet.label);
}

function getKeySentences(content, queryTokens, limit = 2) {
  const sentences = stripMarkdown(String(content || '').replace(/\n+/g, ' '))
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return sentences
    .map((sentence, index) => ({
      sentence,
      score: scoreText(queryTokens, sentence),
      index,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((item) => item.sentence);
}

function buildChunkSynopsis(chunk, query) {
  const queryTokens = tokenize(query);
  const lead = getLeadSentence(chunk.content);
  const highlights = getHighlights(chunk.content, queryTokens);

  if (highlights.length) {
    return [lead, `Highlights include ${joinList(highlights)}.`].filter(Boolean).join(' ');
  }

  const sentences = getKeySentences(chunk.content, queryTokens);
  if (!sentences.length) return lead;

  const uniqueSentences = Array.from(new Set(sentences));
  return uniqueSentences.join(' ');
}

function buildSourceSentence(chunks) {
  const links = Array.from(new Map(chunks.map((chunk) => [chunk.source, chunk])).values())
    .filter((chunk) => chunk?.source)
    .slice(0, 2)
    .map((chunk) => `[${getChunkTitle(chunk)}](${chunk.source})`);

  if (!links.length) return '';
  return `You can also explore ${joinList(links)}.`;
}

function getFollowUp(intent) {
  switch (intent) {
    case 'courses':
      return 'Would you like details on one specific course?';
    case 'products':
      return 'Would you like a quick comparison or details on one product?';
    case 'services':
      return 'Would you like me to suggest the best-fit service for your use case?';
    case 'industries':
      return 'Which industry use case are you exploring?';
    case 'principles':
      return 'Would you like a quick overview of one principle or the full set?';
    case 'contact':
      return 'Would you like the fastest way to reach the team?';
    default:
      return 'Would you like to explore our services, products, or industries next?';
  }
}

function buildCatalogFallback(intent, chunks) {
  if (intent === 'courses') {
    return buildCoursesCatalogAnswer(false);
  }

  const items = Array.from(new Map(chunks.map((chunk) => [chunk.source, chunk])).values())
    .slice(0, 5)
    .map((chunk) => `[${getChunkTitle(chunk)}](${chunk.source})`);

  if (!items.length) return OUT_OF_SCOPE_MSG;

  const intros = {
    courses: 'AiGENThix courses on the website include',
    products: 'AiGENThix products on the website include',
    services: 'AiGENThix service areas on the website include',
    industries: 'AiGENThix highlights industry work in',
    principles: 'AiGENThix core principles include',
  };

  return limitWords(`${intros[intent]} ${joinList(items)}. ${getFollowUp(intent)}`, FALLBACK_MAX_WORDS);
}

function getContactSubIntent(query) {
  const text = String(query || '').toLowerCase();
  if (text.includes('email') || text.includes('mail')) return 'email';
  if (text.includes('phone') || text.includes('number') || text.includes('mobile') || text.includes('call')) return 'phone';
  if (text.includes('address') || text.includes('location') || text.includes('bengaluru') || text.includes('hsr')) {
    return 'address';
  }
  return 'general';
}

function buildContactFallback(query = '') {
  const contactIntent = getContactSubIntent(query);

  if (contactIntent === 'email') {
    return limitWords(
      'You can email AiGENThix at [info@aigenthix.com](mailto:info@aigenthix.com). We also list [aigenthix@gmail.com](mailto:aigenthix@gmail.com) as a secondary address. Would you like the phone number or address too?',
      FALLBACK_MAX_WORDS
    );
  }

  if (contactIntent === 'phone') {
    return limitWords(
      'You can reach AiGENThix at +91 9419904765. If you prefer email, you can also use [info@aigenthix.com](mailto:info@aigenthix.com). Would you like the office address as well?',
      FALLBACK_MAX_WORDS
    );
  }

  if (contactIntent === 'address') {
    return limitWords(
      'AiGENThix is based in HSR Layout, Bengaluru, Karnataka, India. You can also contact the team at [info@aigenthix.com](mailto:info@aigenthix.com). Would you like the phone number too?',
      FALLBACK_MAX_WORDS
    );
  }

  return limitWords(
    'You can reach AiGENThix at [info@aigenthix.com](mailto:info@aigenthix.com) or +91 9419904765, and the team is based in HSR Layout, Bengaluru. You can also use the [Contact Page](/contact). Would you like the email, phone, or address details first?',
    FALLBACK_MAX_WORDS
  );
}

function getRecentConversationContext(history = []) {
  const recent = Array.isArray(history) ? history.slice(-6) : [];
  const lastAssistant = [...recent].reverse().find((message) => message.role === 'assistant')?.content || '';
  const lastUser =
    [...recent].reverse().find(
      (message) =>
        message.role === 'user' &&
        !isGreeting(message.content) &&
        !isAmbiguousFollowUp(message.content)
    )?.content || '';

  const combined = `${lastUser}\n${lastAssistant}`.trim();
  const product = findReferencedProduct(combined);
  const intent = product ? 'products' : detectIntent(combined);

  return {
    intent,
    product,
    lastAssistant,
    lastUser,
  };
}

function buildProductFollowUp(product) {
  if (product) {
    return limitWords(
      `Sure — we can keep going with [${product.name}](${product.source}). Would you like a quick overview, key features, or where it fits best?`,
      FALLBACK_MAX_WORDS
    );
  }

  return limitWords(
    `Sure — AiGENThix products on the website include ${joinList(PRODUCT_OPTIONS.map((product) => product.link))}. Would you like a quick comparison, or details on one product?`,
    FALLBACK_MAX_WORDS
  );
}

function buildProductComparisonAnswer(products) {
  const selectedProducts = products.length ? products : PRODUCT_OPTIONS;
  const intro =
    selectedProducts.length === PRODUCT_OPTIONS.length
      ? "Here's a quick comparison of the AiGENThix products on the website:"
      : `Here's a quick comparison of ${joinList(selectedProducts.map((product) => product.link))}:`;

  const lines = [
    intro,
    ...selectedProducts.map((product) => `* ${product.link} - ${product.summary}`),
    'If you want, I can also compare any two products in more detail.',
  ];

  return limitWords(lines.join('\n'), MAX_RESPONSE_WORDS);
}

function buildComparisonSelectionPrompt(product) {
  const remainingProducts = PRODUCT_OPTIONS.filter((item) => item.name !== product.name);
  return limitWords(
    `I can compare [${product.name}](${product.source}) with ${joinList(remainingProducts.map((item) => item.link))}. Would you like one of those or all products?`,
    FALLBACK_MAX_WORDS
  );
}

function isStandaloneProductComparisonQuery(query) {
  const normalizedQuery = String(query || '').trim();
  if (!COMPARISON_PATTERN.test(normalizedQuery)) return false;
  return detectIntent(normalizedQuery) === 'products' || findReferencedProducts(normalizedQuery).length > 0;
}

function buildStandaloneComparisonAnswer(query, history = []) {
  const normalizedQuery = String(query || '').trim();
  const context = getRecentConversationContext(history);
  const referencedProducts = findReferencedProducts(normalizedQuery);

  if (ALL_PRODUCTS_PATTERN.test(normalizedQuery) && context.intent === 'products' && /compare/i.test(context.lastAssistant)) {
    return buildProductComparisonAnswer(PRODUCT_OPTIONS);
  }

  if (!isStandaloneProductComparisonQuery(normalizedQuery)) {
    return null;
  }

  if (ALL_PRODUCTS_PATTERN.test(normalizedQuery) || !referencedProducts.length) {
    return buildProductComparisonAnswer(PRODUCT_OPTIONS);
  }

  if (referencedProducts.length >= 2) {
    return buildProductComparisonAnswer(referencedProducts);
  }

  return buildComparisonSelectionPrompt(referencedProducts[0]);
}

function buildNegativeFollowUp(context) {
  switch (context.intent) {
    case 'products':
      return limitWords(
        'No problem. If you want, I can still help with another product, a service area, industry focus, or contact details. What would you like to explore next?',
        FALLBACK_MAX_WORDS
      );
    case 'services':
      return limitWords(
        'No problem. If you want, I can help you explore another AiGENThix service or point you to the right offering for your use case.',
        FALLBACK_MAX_WORDS
      );
    case 'contact':
      return limitWords(
        'No problem. If you need anything later, I can still help with contact details, services, products, or industry-specific information.',
        FALLBACK_MAX_WORDS
      );
    default:
      return limitWords(
        'No problem. I can still help with AiGENThix products, services, industries, principles, or contact details whenever you\'re ready.',
        FALLBACK_MAX_WORDS
      );
  }
}

function buildContextualFollowUp(query, history = []) {
  if (!isAmbiguousFollowUp(query)) return null;

  const context = getRecentConversationContext(history);
  const normalizedQuery = String(query || '').trim();

  if (NEGATIVE_PATTERN.test(normalizedQuery)) {
    return buildNegativeFollowUp(context);
  }

  if (COMPARISON_PATTERN.test(normalizedQuery) && context.intent === 'products') {
    return buildProductComparisonAnswer(PRODUCT_OPTIONS);
  }

  if (ALL_PRODUCTS_PATTERN.test(normalizedQuery) && context.intent === 'products' && /compare/i.test(context.lastAssistant)) {
    return buildProductComparisonAnswer(PRODUCT_OPTIONS);
  }

  if (DETAIL_FOLLOW_UP_PATTERN.test(normalizedQuery) && context.intent === 'products' && context.product) {
    return limitWords(
      `Sure — let’s look at [${context.product.name}](${context.product.source}) in more detail. Would you like its key features, ideal use case, or a quick summary?`,
      FALLBACK_MAX_WORDS
    );
  }

  const isPlainAffirmation =
    AFFIRMATIVE_PATTERN.test(normalizedQuery) &&
    !COMPARISON_PATTERN.test(normalizedQuery) &&
    !DETAIL_FOLLOW_UP_PATTERN.test(normalizedQuery) &&
    !SELECTION_PATTERN.test(normalizedQuery);

  if (isPlainAffirmation && context.intent === 'products' && !context.product) {
    return limitWords(
      'Sure — would you like a quick comparison between the products, or details on one specific product?',
      FALLBACK_MAX_WORDS
    );
  }

  switch (context.intent) {
    case 'products':
      return buildProductFollowUp(context.product);
    case 'services':
      return limitWords(
        "Sure — tell me what you're trying to build or improve, and I'll point you to the most relevant AiGENThix service.",
        FALLBACK_MAX_WORDS
      );
    case 'industries':
      return limitWords(
        'Sure — are you exploring healthcare, finance, education, retail & e-commerce, manufacturing, or enterprise solutions?',
        FALLBACK_MAX_WORDS
      );
    case 'principles':
      return limitWords(
        'Sure — would you like the full core-principles overview or a quick explanation of one principle?',
        FALLBACK_MAX_WORDS
      );
    case 'contact':
      return buildContactFallback(query);
    default:
      return limitWords(
        'Sure — what would you like to explore next: products, services, industries, principles, or contact details?',
        FALLBACK_MAX_WORDS
      );
  }
}

function buildFallbackAnswer(query, chunks) {
  const intent = detectIntent(query);

  if (intent === 'courses') {
    return buildCoursesCatalogAnswer(false);
  }

  if (intent === 'contact') {
    return buildContactFallback(query);
  }

  if (CATALOG_PATTERNS[intent]?.test(query)) {
    return buildCatalogFallback(intent, chunks);
  }

  const uniqueChunks = Array.from(new Map(chunks.map((chunk) => [chunk.id, chunk])).values()).slice(0, 2);
  const synopses = uniqueChunks.map((chunk) => buildChunkSynopsis(chunk, query)).filter(Boolean);

  if (!synopses.length) {
    return OUT_OF_SCOPE_MSG;
  }

  const response = [
    synopses.join(' '),
    buildSourceSentence(uniqueChunks),
    getFollowUp(intent),
  ]
    .filter(Boolean)
    .join(' ');

  return limitWords(response, FALLBACK_MAX_WORDS);
}

export function retrieve(query, k = TOP_K) {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return [];

  const intent = detectIntent(query);

  const scored = KNOWLEDGE_CHUNKS.map((chunk) => {
    let score = scoreChunk(queryTokens, chunk);

    const id = String(chunk.id || '');
    const src = String(chunk.source || '');

    if (intent === 'products' && id.startsWith('prod-')) score = Math.min(1, score + 0.2);
    if (intent === 'services' && id.startsWith('svc-')) score = Math.min(1, score + 0.2);
    if (intent === 'industries' && id.startsWith('ind-')) score = Math.min(1, score + 0.2);
    if (intent === 'principles' && (id.startsWith('principle') || id.startsWith('principles'))) score = Math.min(1, score + 0.25);
    if (intent === 'contact' && (id.includes('contact') || id.includes('brand'))) score = Math.min(1, score + 0.3);

    if (src && String(query || '').toLowerCase().includes(src.replaceAll('/', ' ').trim())) {
      score = Math.min(1, score + 0.12);
    }

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored
    .filter((s) => s.score >= MIN_RELEVANCE)
    .slice(0, k)
    .map((s) => s.chunk);
}

export function isBlocked(query) {
  const q = (query || '').trim();
  if (!q || q.length < 2) return true;
  return BLOCKED_PATTERNS.some((re) => re.test(q));
}

async function callBackendLLM(question, context) {
  if (Date.now() < llmCooldownUntil) {
    return null;
  }

  try {
    const res = await apiClient.post('/api/chat', { question, context });
    llmCooldownUntil = 0;
    return res?.answer || null;
  } catch (err) {
    const message = String(err?.message || '').toLowerCase();
    if (message.includes('429') || message.includes('rate limit') || message.includes('quota')) {
      llmCooldownUntil = Date.now() + LLM_RATE_LIMIT_COOLDOWN_MS;
    } else if (
      message.includes('503') ||
      message.includes('busy') ||
      message.includes('high demand') ||
      message.includes('unavailable')
    ) {
      llmCooldownUntil = Date.now() + LLM_BUSY_COOLDOWN_MS;
    }
    console.warn('Chat backend unavailable, using local fallback', err);
    return null;
  }
}

export async function getAnswer(query, history = []) {
  const q = (query || '').trim();
  if (!q) return 'Please type a question about AiGENThix.';

  if (isGreeting(q)) return GREETING_MSG;
  if (isBlocked(q)) return GUARDRAIL_BLOCK_MSG;

  const courseCatalogReply = buildCourseCatalogReply(q, history);
  if (courseCatalogReply) return courseCatalogReply;

  const standaloneComparisonAnswer = buildStandaloneComparisonAnswer(q, history);
  if (standaloneComparisonAnswer) return standaloneComparisonAnswer;

  const contextualFollowUp = buildContextualFollowUp(q, history);
  if (contextualFollowUp) return contextualFollowUp;

  const chunks = retrieve(q);
  if (!chunks.length) return OUT_OF_SCOPE_MSG;

  const context = chunks
    .map((c) => `[source: ${c.source}] ${c.content}`)
    .join('\n\n');

  const llmAnswer = await callBackendLLM(q, context);
  if (llmAnswer) return finalizeAnswer(llmAnswer, q, chunks);

  return buildFallbackAnswer(q, chunks);
}
