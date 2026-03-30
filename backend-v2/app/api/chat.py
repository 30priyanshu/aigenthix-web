from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.schemas.chat import ChatRequest, ChatResponse

from google import genai
from google.genai import types as genai_types


router = APIRouter(prefix="/api/chat", tags=["chat"])


def _get_gemini_client() -> genai.Client:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured on the server")
    return genai.Client(api_key=api_key)


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
        client = _get_gemini_client()
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

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_content,
            config=genai_types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.5,
                top_p=0.9,
                max_output_tokens=1024,
            ),
        )
    except Exception as exc:  # pragma: no cover - runtime safety
        print(f"Gemini API Error: {exc}")
        raise HTTPException(status_code=500, detail=f"Chat service error: {str(exc)}") from exc

    text = (response.text or "").strip()
    if not text:
        text = (
            "I can only answer questions about AiGENThix, our services, products, and "
            "information that appears on our website. "
            "Please contact info@aigenthix.com for more details."
        )

    return ChatResponse(answer=text)

