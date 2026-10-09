from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import TenantContext, require_staff_or_owner
from app.database import get_db
from app.schemas import (
    AISetupRequest,
    AISetupResponse,
    ChatRequest,
    ChatResponse,
    ChatTable,
    ChatToolDirectRequest,
)
from app.services.chat_tools import CHAT_TOOL_REGISTRY
from app.services.gemini_service import (
    execute_chatbot_query,
    get_ai_setup_suggestions,
)

router = APIRouter(tags=["AI Services & Chatbot"])


@router.post("/ai/setup-suggestions", response_model=AISetupResponse)
def get_store_setup_suggestions(data: AISetupRequest) -> AISetupResponse:
    """Use Gemini structured generation to propose categories, tagline, and theme for wizard step 1."""
    return get_ai_setup_suggestions(data.description)


@router.post("/chat", response_model=ChatResponse)
def chat_with_store_assistant(
    data: ChatRequest,
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> ChatResponse:
    """Merchant AI assistant: Gemini selects the optimal tool; backend computes numbers strictly for this store."""
    if not tenant.store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    res = execute_chatbot_query(db=db, store_id=tenant.store_id, user_message=data.message)
    table_obj = ChatTable(**res["table"]) if res.get("table") else None

    return ChatResponse(
        answer=res["answer"],
        table=table_obj,
        tool=res.get("tool"),
        params=res.get("params"),
    )


@router.post("/chat/tool", response_model=ChatResponse)
def direct_tool_execution(
    data: ChatToolDirectRequest,
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> ChatResponse:
    """Direct chip execution: runs analytics tool directly without LLM dependency (fail-safe for live demos)."""
    if not tenant.store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    if data.tool not in CHAT_TOOL_REGISTRY:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown tool '{data.tool}'. Available: {list(CHAT_TOOL_REGISTRY.keys())}",
        )

    tool_fn = CHAT_TOOL_REGISTRY[data.tool]
    execution_result = tool_fn(db=db, store_id=tenant.store_id, **data.params)
    table_obj = ChatTable(**execution_result["table"]) if execution_result.get("table") else None

    return ChatResponse(
        answer=execution_result["answer"],
        table=table_obj,
        tool=data.tool,
        params=data.params,
    )
