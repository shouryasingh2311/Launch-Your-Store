import hashlib
import time
from typing import Any
from google import genai
from google.genai import types

from app.config import settings
from app.schemas import AISetupResponse, AISuggestedCategory
from app.services.chat_tools import CHAT_TOOL_REGISTRY

# In-memory 60-second response cache: {cache_key: (timestamp, response_dict)}
_CHAT_CACHE: dict[str, tuple[float, dict[str, Any]]] = {}


def get_gemini_client() -> genai.Client | None:
    """Return a genai.Client if GEMINI_API_KEY is configured."""
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY.strip() == "":
        return None
    try:
        return genai.Client(api_key=settings.GEMINI_API_KEY.strip())
    except Exception:
        return None


def get_ai_setup_suggestions(description: str) -> AISetupResponse:
    """Generate business categories, tagline, and theme from a description."""
    client = get_gemini_client()

    prompt = f"""
Analyze this small business description: "{description.strip()}".
Suggest 4-6 relevant product categories (each with a single fitting emoji), an engaging tagline, and the best matching theme from ["minimal", "vibrant", "elegant", "midnight"].
    """

    if client:
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=AISetupResponse,
                    temperature=0.3,
                ),
            )
            if response.text:
                return AISetupResponse.model_validate_json(response.text)
        except Exception:
            pass  # Fall back to heuristic defaults on API failure or rate limit

    # Intelligent fallback heuristics based on description keywords
    desc_lower = description.lower()
    if any(k in desc_lower for k in ["jewel", "luxury", "gold", "silver", "craft", "heritage", "artisan"]):
        theme = "elegant"
        cats = [
            AISuggestedCategory(name="Fine Jewellery", emoji="💍"),
            AISuggestedCategory(name="Handcrafted Necklaces", emoji="✨"),
            AISuggestedCategory(name="Silver Earrings", emoji="🌟"),
            AISuggestedCategory(name="Artisanal Rings", emoji="💎"),
        ]
        tagline = "Timeless Handcrafted Elegance."
    elif any(k in desc_lower for k in ["tech", "gadget", "phone", "electronics", "audio", "pc", "gaming"]):
        theme = "midnight"
        cats = [
            AISuggestedCategory(name="Audio & Headphones", emoji="🎧"),
            AISuggestedCategory(name="Smart Accessories", emoji="⌚"),
            AISuggestedCategory(name="Cables & Chargers", emoji="⚡"),
            AISuggestedCategory(name="Gaming Gear", emoji="🎮"),
        ]
        tagline = "Next-Gen Gear for Modern Life."
    elif any(k in desc_lower for k in ["organic", "food", "coffee", "grocery", "tea", "bakery", "snack"]):
        theme = "vibrant"
        cats = [
            AISuggestedCategory(name="Fresh Brews", emoji="☕"),
            AISuggestedCategory(name="Artisanal Breads", emoji="🍞"),
            AISuggestedCategory(name="Organic Staples", emoji="🥑"),
            AISuggestedCategory(name="Gourmet Snacks", emoji="🍪"),
        ]
        tagline = "Pure, Wholesome Goodness Daily."
    else:
        theme = "minimal"
        cats = [
            AISuggestedCategory(name="Featured Collection", emoji="⭐"),
            AISuggestedCategory(name="New Arrivals", emoji="📦"),
            AISuggestedCategory(name="Best Sellers", emoji="🔥"),
            AISuggestedCategory(name="Essentials", emoji="🏷️"),
        ]
        tagline = "Carefully Curated for You."

    return AISetupResponse(categories=cats, tagline=tagline, theme_id=theme)


# Gemini tool definitions for chatbot function calling
CHATBOT_TOOLS = [
    types.Tool(
        function_declarations=[
            types.FunctionDeclaration(
                name="top_products",
                description="Get top products ranked by revenue or units sold for a period.",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "period": types.Schema(
                            type=types.Type.STRING,
                            description="Time period: today, this_week, last_week, this_month, last_month, last_7_days, last_30_days",
                        ),
                        "limit": types.Schema(type=types.Type.INTEGER, description="Number of products to return, default 5"),
                        "by": types.Schema(type=types.Type.STRING, description="'revenue' or 'units'"),
                    },
                ),
            ),
            types.FunctionDeclaration(
                name="low_stock",
                description="Get products with current stock at or below a threshold.",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "threshold": types.Schema(type=types.Type.INTEGER, description="Stock count threshold, default 5"),
                    },
                ),
            ),
            types.FunctionDeclaration(
                name="revenue_compare",
                description="Compare revenue and order count between two periods.",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "period_a": types.Schema(type=types.Type.STRING, description="First period, e.g. this_week"),
                        "period_b": types.Schema(type=types.Type.STRING, description="Second period, e.g. last_week"),
                    },
                    required=["period_a", "period_b"],
                ),
            ),
            types.FunctionDeclaration(
                name="orders_summary",
                description="Get order count and revenue summary with status breakdown for a period.",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "period": types.Schema(type=types.Type.STRING, description="Time period, e.g. this_month"),
                        "status": types.Schema(type=types.Type.STRING, description="Optional status filter"),
                    },
                ),
            ),
            types.FunctionDeclaration(
                name="sales_by_category",
                description="Get sales volume and revenue grouped by category for a period.",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "period": types.Schema(type=types.Type.STRING, description="Time period, e.g. this_month"),
                    },
                ),
            ),
            types.FunctionDeclaration(
                name="product_info",
                description="Get details, price, current stock, and SKU for a named product.",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "name": types.Schema(type=types.Type.STRING, description="Product name to search"),
                    },
                    required=["name"],
                ),
            ),
        ]
    )
]


def execute_chatbot_query(
    db: Any,
    store_id: int,
    user_message: str,
) -> dict[str, Any]:
    """Execute merchant chatbot query with tool calling, caching, and strict honesty."""
    # Check 60-second cache
    cache_key = f"{store_id}:{hashlib.md5(user_message.strip().lower().encode()).hexdigest()}"
    now = time.time()
    if cache_key in _CHAT_CACHE:
        cached_time, cached_res = _CHAT_CACHE[cache_key]
        if now - cached_time < 60:
            return cached_res

    client = get_gemini_client()
    chosen_tool: str | None = None
    tool_params: dict[str, Any] = {}

    if client:
        try:
            chat_prompt = f"""
You are an e-commerce data assistant for this store.
Merchant question: "{user_message.strip()}".
Select the best tool to retrieve the exact figures.
If the question is unrelated to store data or cannot be answered by the available tools (e.g. asking about competitor stores, recipes, general facts), do not call any tool.
            """
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=chat_prompt,
                config=types.GenerateContentConfig(
                    tools=CHATBOT_TOOLS,
                    temperature=0.0,
                ),
            )

            # Check if Gemini made a function call
            if response.function_calls:
                fn_call = response.function_calls[0]
                if fn_call.name in CHAT_TOOL_REGISTRY:
                    chosen_tool = fn_call.name
                    tool_params = dict(fn_call.args or {})
        except Exception:
            pass  # Fall back to heuristic rule matcher

    # If Gemini didn't make a function call, check keyword heuristics (fallback mode)
    if not chosen_tool:
        msg_lower = user_message.lower()
        if any(w in msg_lower for w in ["top", "best seller", "highest sale", "most popular"]) or ("selling" in msg_lower and "product" in msg_lower):
            chosen_tool = "top_products"
            tool_params = {"period": "this_month", "limit": 5}
        elif any(w in msg_lower for w in ["low stock", "out of stock", "reorder", "inventory low", "low on stock"]) or ("low" in msg_lower and "stock" in msg_lower):
            chosen_tool = "low_stock"
            tool_params = {"threshold": 5}
        elif any(w in msg_lower for w in ["compare", "vs", "versus"]):
            chosen_tool = "revenue_compare"
            tool_params = {"period_a": "this_week", "period_b": "last_week"}
        elif any(w in msg_lower for w in ["category", "categories", "department"]):
            chosen_tool = "sales_by_category"
            tool_params = {"period": "this_month"}
        elif any(w in msg_lower for w in ["orders", "how many order", "order summary"]):
            chosen_tool = "orders_summary"
            tool_params = {"period": "this_month"}

    # If still no tool matches, return honest refusal per hackathon requirement
    if not chosen_tool or chosen_tool not in CHAT_TOOL_REGISTRY:
        result = {
            "answer": "I don't have that data.",
            "table": None,
            "tool": None,
            "params": None,
        }
        _CHAT_CACHE[cache_key] = (now, result)
        return result

    # Execute backend query securely with server-injected store_id
    tool_fn = CHAT_TOOL_REGISTRY[chosen_tool]
    execution_result = tool_fn(db=db, store_id=store_id, **tool_params)

    result = {
        "answer": execution_result["answer"],
        "table": execution_result.get("table"),
        "tool": chosen_tool,
        "params": tool_params,
    }
    _CHAT_CACHE[cache_key] = (now, result)
    return result
