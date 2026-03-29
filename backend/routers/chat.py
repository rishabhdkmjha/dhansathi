from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest
from services.ai_service import get_ai_chat
from prompts.system_prompts import CHAT_SYSTEM

router = APIRouter()


@router.post("/chat", summary="Chat with DhanSathi AI")
async def chat(req: ChatRequest):
    try:
        messages = [{"role": m.role, "content": m.content} for m in req.history]

        user_content = req.message
        if req.context:
            ctx = req.context
            user_content = (
                f"[User context: Income \u20b9{ctx.get('income', 'unknown')}, "
                f"Age {ctx.get('age', 'unknown')}, "
                f"Employment: {ctx.get('employment', 'unknown')}]\n\n{req.message}"
            )

        messages.append({"role": "user", "content": user_content})
        reply = await get_ai_chat(messages, CHAT_SYSTEM)

        suggested_tools = []
        msg_lower = req.message.lower()
        if any(w in msg_lower for w in ["tax", "80c", "deduction", "save tax", "regime", "tds"]):
            suggested_tools.append("tax_advisor")
        if any(w in msg_lower for w in ["invest", "mutual fund", "sip", "stock", "portfolio", "fd", "ppf"]):
            suggested_tools.append("investment_advisor")

        return {"reply": reply, "suggested_tools": suggested_tools}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))