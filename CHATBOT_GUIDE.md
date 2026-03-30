# AiGENThix Website Chatbot (RAG + Guardrails) — Guide

## Overview
This project adds a **website-only** chatbot to `website-v2` that answers naturally using an LLM **but only from content present on the AiGENThix website**.

Architecture:
- **Frontend (React/Vite)**: retrieves relevant website chunks (RAG) + client guardrails + calls backend for natural response
- **Backend (FastAPI)**: calls **Gemini** and forces it to answer **only** from the provided context

## Chat flow (end-to-end)
1. **User asks a question** in the floating chatbot UI (`ChatbotWidget.jsx`).
2. `ChatbotWidget.jsx` calls `getAnswer(query)` from `chatService.js`.
3. `chatService.js` runs **guardrails**:
   - Blocks harmful/jailbreak prompts.
   - If blocked → returns a refusal message.
4. `chatService.js` runs **RAG retrieval**:
   - Scores every item in `KNOWLEDGE_CHUNKS` (`knowledgeBase.js`) using token overlap.
   - For product-like questions, it **biases toward product chunks** (`id` starting with `prod-`).
   - Picks top-k chunks and builds a **context** string (includes `[source: /page]` tags).
   - If nothing relevant → returns an “out of scope” website-only message.
5. `chatService.js` calls backend: `POST /api/chat` with:
   - `question`: user message
   - `context`: retrieved website chunks only
6. Backend `backend-v2/app/api/chat.py` calls **Gemini** with:
   - A **system instruction** that forbids hallucinations and forces context-only answers
   - A professional, friendly style (bullets for features) and optional 1 follow-up question
7. Backend returns `{ "answer": "..." }` to the frontend.
8. Frontend displays the assistant message.

### Example chat (Products)
**User:** “Tell me about Sahayak AI.”  
**RAG retrieves context from:** `/products/sahayak-ai`  
**Assistant (Gemini, grounded):**
- Sahayak AI is an AI-powered education platform for teachers to create content faster and manage classrooms intelligently.
- Key capabilities include AI content creation (worksheets/quizzes/lesson plans), smart lesson planning, attendance automation using face recognition, and student performance tracking.

**Follow-up (optional):** “Are you looking for Sahayak AI for a school, a coaching institute, or individual educators?”

## What was built (files)

### Frontend (`website-v2`)
- **Knowledge base**: `website-v2/src/data/knowledgeBase.js`
  - Contains curated chunks from website pages (About/FAQ/Services/Products/Industries/Contact/Legal)
  - Each chunk has: `id`, `source`, `content`, `keywords`

- **RAG + guardrails service**: `website-v2/src/components/chatbot/chatService.js`
  - Retrieves top-k relevant chunks using token overlap scoring
  - **Guardrails (client-side)** block harmful/jailbreak prompts
  - Calls backend endpoint: `POST /api/chat` with `{ question, context }`
  - If backend is unavailable, falls back to a “website-only” answer from retrieved chunks

- **Draggable chatbot UI widget**: `website-v2/src/components/chatbot/ChatbotWidget.jsx`
  - Floating, **draggable** chat icon
  - Professional chat UI (dark glass style, message bubbles, loading indicator)
  - No “Powered by Gemini” marketing text in UI

- **Global placement on all pages**: `website-v2/src/components/Footer.jsx`
  - Imports and renders `ChatbotWidget`
  - Because the widget is `position: fixed`, it appears on all routes/pages.

### Backend (`backend-v2`)
- **Gemini dependency**: `backend-v2/requirements.txt`
  - Added `google-genai`

- **Env config**: `backend-v2/app/core/config.py`
  - Added `GEMINI_API_KEY` (read from `.env`)

- **Schemas**: `backend-v2/app/schemas/chat.py`
  - `ChatRequest`: `question`, `context`
  - `ChatResponse`: `answer`

- **Chat API**: `backend-v2/app/api/chat.py`
  - `POST /api/chat`
  - Uses model `gemini-2.5-flash`
  - Strict instruction: **answer only using provided website context**; otherwise refuse and suggest contacting `info@aigenthix.com`

- **Router wiring**: `backend-v2/app/main.py`
  - Includes the chat router via `app.include_router(chat.router)`

## Guardrails (website-only + safety)

### Client-side guardrails
Implemented in `website-v2/src/components/chatbot/chatService.js`:
- Blocks prompts containing hacking/illegal/violence/nsfw/jailbreak patterns.
- If retrieval finds no relevant site chunk, the bot refuses and asks user to stay within site topics.

### Server-side guardrails
Implemented in `backend-v2/app/api/chat.py`:
- Gemini receives a system instruction that it must only use provided context.
- If context is insufficient, it must refuse and recommend contacting `info@aigenthix.com`.

## Environment setup

### Backend `.env` (`backend-v2/.env`)
Add:
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

You can create a Gemini API key from Google AI Studio.

### Frontend `.env` (`website-v2/.env`)
Ensure backend URL is set:
```env
VITE_API_URL=http://localhost:8000
```

## How to run (local)

### 1) Start backend
```bash
cd backend-v2
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### 2) Start frontend
```bash
cd website-v2
npm install
npm run dev
```

Open the website and use the floating chatbot button on any page.

## Notes / Troubleshooting
- If responses are not “natural”, confirm:
  - `GEMINI_API_KEY` is set and backend is running
  - `VITE_API_URL` points to the correct backend
- If backend returns 503: Gemini key is missing on the server.

## Improving answer quality (tuning)
If answers feel off-topic, the usual causes are:
- Not enough product content in `knowledgeBase.js` → add more product chunks
- Retrieval not picking the right chunks → adjust `TOP_K`, `MIN_RELEVANCE`, and product biasing in `chatService.js`
- Model not following grounding → strengthen `system_instruction` and keep `[source: ...]` tags in context

