from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.schemas.chat import ChatRequest, ChatResponse

from google import genai
from google.genai import types as genai_types


router = APIRouter(prefix="/api/chat", tags=["chat"])


def _get_gemini_api_keys() -> list[str]:
    api_keys = settings.gemini_api_keys
    if not api_keys:
        raise RuntimeError("GEMINI_API_KEY or GEMINI_API_KEY_2 is not configured on the server")
    return api_keys


def _is_retryable_upstream_error(exc: Exception) -> bool:
    lowered = str(exc).strip().lower()
    return any(
        token in lowered
        for token in ("429", "rate limit", "quota", "503", "unavailable", "high demand", "overloaded", "resource exhausted")
    )


def _raise_upstream_chat_error(exc: Exception) -> None:
    message = str(exc).strip()
    lowered = message.lower()

    if any(token in lowered for token in ("503", "unavailable", "high demand", "overloaded", "resource exhausted")):
        raise HTTPException(
            status_code=503,
            detail="Chat service is temporarily busy because the AI model is under high demand. Please try again shortly.",
        ) from exc

    if any(token in lowered for token in ("429", "rate limit", "quota")):
        raise HTTPException(
            status_code=429,
            detail="Chat service is being rate limited right now. Please try again in a moment.",
        ) from exc

    raise HTTPException(status_code=500, detail=f"Chat service error: {message}") from exc


@router.post("", response_model=ChatResponse)
async def chat_with_gemini(payload: ChatRequest) -> ChatResponse:
    """
    Chat endpoint used by the website chatbot.

    Guardrails:
    - Only answer using the provided `context` (RAG from website content)
    - If context is not enough, respond with a constrained fallback message
    """
    # Basic server-side guardrail: very short or empty input
    q = payload.question.strip()
    if not q or len(q) < 2:
        raise HTTPException(status_code=400, detail="Question is too short")

    try:
        api_keys = _get_gemini_api_keys()
    except RuntimeError as exc:
        # Make missing config obvious to frontend/dev
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    system_prompt = (
        "You are the official AiGENThix website assistant.\n"
        "You MUST answer ONLY using the provided website context.\n"
        "If the context does not contain enough information to answer,\n"
        "say that you can only answer questions about AiGENThix and its website.\n"
        "\n"
        "Style & Formatting:\n"
        "- Tone: professional, very friendly, and confident.\n"
        "- Match the user's exact intent. Only mention the parts of the context that help answer that question.\n"
        "- For simple greetings like hi, hello, or hey, reply with a short welcome and one question about what they want to explore.\n"
        "- Keep most answers between 60 and 140 words, and never exceed 500 words.\n"
        "- Avoid repeating the same company description or contact details.\n"
        "- Keep the response direct and precise without duplication. DO NOT output any extra bullet points or sub-bullets under main items.\n"
        "- ALWAYS include explicit markdown links when mentioning specific pages or topics, formatted exactly like: [Link Text](/url). Do NOT expose the raw URL text outside the bracket.\n"
        "- Make sure to also make emails clickable like [info@aigenthix.com](mailto:info@aigenthix.com).\n"
        "\n"
        "STRICT LIST GUIDELINES: When asked about any of the following topics, ONLY output the items listed below with a single short sentence description. ABSOLUTELY NO EXTRA BULLET POINTS OR DETAILS.\n"
        "\n"
        "1. **Products** (When asked about products, ALWAYS list these including the R&D products):\n"
        "  * [Sahayak AI](/products/sahayak-ai) - AI-powered intelligent assistance for your business.\n"
        "  * [AI Interviewer](/products/ai-interviewer) - Automated AI to conduct and assess interviews.\n"
        "  * [Video Translation](/products/video-translation) - Precision AI video translation and dubbing.\n"
        "  * [Project Management Tool](/products/project-management) - Advanced AI-driven project management.\n"
        "  * [AI Receptionist v1.0 (R&D)](/research-development) - A smart, interactive humanoid assistant.\n"
        "\n"
        "2. **Services**:\n"
        "  * [GENERATIVE AI](/services/generative-ai)\n"
        "  * [ARTIFICIAL INTELLIGENCE & ML](/services/ai-ml)\n"
        "  * [ROBOTICS](/services/robotics)\n"
        "  * [HUMANOIDS](/services/humanoids)\n"
        "  * [CYBERSECURITY](/services/cybersecurity)\n"
        "  * [DATA ENGINEERING](/services/data-engineering)\n"
        "  * [WEB3](/services/web3)\n"
        "  * [SOFTWARE DEVELOPMENT](/services/software-development)\n"
        "  * [IOT & EMBEDDED SYSTEMS](/services/iot)\n"
        "  * [API INTEGRATION SERVICES](/services/api-integration)\n"
        "  * [BLOCKCHAIN TECHNOLOGY](/services/blockchain)\n"
        "\n"
        "3. **Industries**:\n"
        "  * [ENTERPRISE SOLUTIONS](/industries/enterprise-solutions)\n"
        "  * [FINANCE](/industries/finance)\n"
        "  * [HEALTHCARE](/industries/healthcare)\n"
        "  * [EDUCATION TECHNOLOGY](/industries/education)\n"
        "  * [RETAIL & E-COMMERCE](/industries/retail-ecommerce)\n"
        "  * [MANUFACTURING](/industries/manufacturing)\n"
        "\n"
        "4. **Learning and Development (L&D)**:\n"
        "  * [Data Engineering](/learning-and-development/data-engineering)\n"
        "  * [Data Analytics](/learning-and-development/data-analytics)\n"
        "  * [AI & Machine Learning](/learning-and-development/ai-ml)\n"
        "  * [AI & MLOps](/learning-and-development/mlops)\n"
        "  * [Generative AI](/learning-and-development/generative-ai)\n"
        "  * [Agentic AI](/learning-and-development/agentic-ai)\n"
        "\n"
        "5. **Research & Development (R&D)** (When specifically asked about R&D):\n"
        "  * [AI Receptionist v1.0](/research-development) - A next-generation smart humanoid assistant designed to engage visitors, answer queries instantly, and elevate the professional experience at events and corporate venues.\n"
        "\n"
        "- When asked about general pages, use these markdown links:\n"
        "  * Products -> [Products Page](/products)\n"
        "  * Research & Development (R&D) -> [R&D Page](/research-development)\n"
        "  * Core Principles -> [Our Principles](/principles)\n"
        "  * Contact Us -> [Contact Page](/contact)\n"
        "- AT THE VERY END of every response, you MUST always ask ONE friendly and relevant follow-up question to keep the conversation engaging and understand the user's needs better.\n"
    )

    user_content = (
        "Use ONLY the following website context to answer.\n\n"
        f"Website context:\n{payload.context}\n\n"
        f"User question:\n{payload.question}\n\n"
        "Write a natural, helpful answer. "
        "If the context does not contain the answer, say you can only answer "
        "questions about AiGENThix and suggest contacting [info@aigenthix.com](mailto:info@aigenthix.com)."
    )

    response = None
    for index, api_key in enumerate(api_keys):
        client = genai.Client(api_key=api_key)
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=user_content,
                config=genai_types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.5,
                    top_p=0.9,
                    max_output_tokens=420,
                ),
            )
            break
        except Exception as exc:  # pragma: no cover - runtime safety
            print(f"Gemini API Error (key {index + 1}/{len(api_keys)}): {exc}")
            has_fallback_key = index < len(api_keys) - 1
            if has_fallback_key and _is_retryable_upstream_error(exc):
                continue
            _raise_upstream_chat_error(exc)

    if response is None:  # pragma: no cover - defensive fallback
        raise HTTPException(status_code=503, detail="Chat service is temporarily unavailable. Please try again shortly.")

    text = (response.text or "").strip()
    if not text:
        text = (
            "I can help with AiGENThix topics from our website, including services, products, "
            "industries, principles, and contact details. "
            "You can also reach us at [info@aigenthix.com](mailto:info@aigenthix.com). "
            "What would you like to explore?"
        )

    return ChatResponse(answer=text)
