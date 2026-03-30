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

const OUT_OF_SCOPE_MSG =
  "I'm sorry, I can only provide information related to AiGENThix's website, including our company, services, products, industries, core principles, and contact details. Could you please ask a question related to these topics?";

const GUARDRAIL_BLOCK_MSG =
  "I'm here to help with questions about AiGENThix and our offerings. I cannot assist with that type of request. Please ask about our company, services, products, industries, core principles, or contact details.";

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
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
        if (ct.includes(t) || t.includes(ct)) {
          matches += 0.5;
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

function detectIntent(q) {
  const s = (q || '').toLowerCase();
  if (PRODUCT_HINTS.some((h) => s.includes(h))) return 'products';
  if (CONTACT_HINTS.some((h) => s.includes(h))) return 'contact';
  if (PRINCIPLE_HINTS.some((h) => s.includes(h))) return 'principles';
  if (INDUSTRY_HINTS.some((h) => s.includes(h))) return 'industries';
  if (SERVICE_HINTS.some((h) => s.includes(h))) return 'services';
  return 'general';
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
  try {
    const res = await apiClient.post('/api/chat', { question, context });
    return res?.answer || null;
  } catch (err) {
    console.error('Chat backend error', err);
    return null;
  }
}

export async function getAnswer(query) {
  const q = (query || '').trim();
  if (!q) return 'Please type a question about AiGENThix.';

  if (isBlocked(q)) return GUARDRAIL_BLOCK_MSG;

  const chunks = retrieve(q);
  if (!chunks.length) return OUT_OF_SCOPE_MSG;

  const context = chunks
    .map((c) => `[source: ${c.source}] ${c.content}`)
    .join('\n\n');

  const llmAnswer = await callBackendLLM(q, context);
  if (llmAnswer) return llmAnswer;

  const unique = Array.from(new Map(chunks.map((c) => [c.id, c])).values());
  const parts = unique.map((c) => c.content.trim());
  return "Here is what I found about that from the AiGENThix website:\n\n" + parts.join('\n\n');
}

