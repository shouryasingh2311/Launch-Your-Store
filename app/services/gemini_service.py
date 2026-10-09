import hashlib
import json
import time
from typing import Any
import httpx
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


def _call_groq_setup_suggestions(description: str) -> AISetupResponse | None:
    """Fallback: call Groq API with structured JSON output."""
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY.strip() == "":
        return None
    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY.strip()}",
            "Content-Type": "application/json",
        }
        prompt = f"""
Analyze this small business description: "{description.strip()}".
Suggest 4-6 relevant product categories (each with a single fitting emoji), an engaging tagline, and the best matching theme from ["minimal", "vibrant", "elegant", "midnight", "modern", "warm", "bold", "dark", "playful"].
Respond strictly with valid JSON with this exact structure:
{{
  "categories": [
    {{"name": "Category Name", "emoji": "emoji"}}
  ],
  "tagline": "Engaging tagline",
  "theme_id": "theme"
}}
"""
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"},
            "temperature": 0.3,
        }
        with httpx.Client(timeout=10.0) as http_client:
            resp = http_client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                content = resp.json()["choices"][0]["message"]["content"]
                return AISetupResponse.model_validate_json(content)
    except Exception:
        pass
    return None


def get_ai_setup_suggestions(description: str) -> AISetupResponse:
    """Generate business categories, tagline, and theme from a description with multi-provider fallback."""
    # 1. Primary: Google Gemini
    client = get_gemini_client()
    if client:
        try:
            prompt = f"""
Analyze this small business description: "{description.strip()}".
Suggest 4-6 relevant product categories (each with a single fitting emoji), an engaging tagline, and the best matching theme from ["minimal", "vibrant", "elegant", "midnight"].
            """
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
            pass  # Fall back to Groq

    # 2. Secondary: Groq Fallback
    groq_res = _call_groq_setup_suggestions(description)
    if groq_res:
        return groq_res

    # 3. Tertiary: Intelligent local keyword heuristics
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


# Gemini tool definitions
GEMINI_CHATBOT_TOOLS = [
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

# Groq OpenAI-compatible tool definitions
GROQ_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "top_products",
            "description": "Get top products ranked by revenue or units sold for a period.",
            "parameters": {
                "type": "object",
                "properties": {
                    "period": {"type": "string", "description": "Time period: today, this_week, last_week, this_month, last_month, last_7_days, last_30_days"},
                    "limit": {"type": "integer", "description": "Number of products to return, default 5"},
                    "by": {"type": "string", "description": "'revenue' or 'units'"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "low_stock",
            "description": "Get products with current stock at or below a threshold.",
            "parameters": {
                "type": "object",
                "properties": {
                    "threshold": {"type": "integer", "description": "Stock count threshold, default 5"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "revenue_compare",
            "description": "Compare revenue and order count between two periods.",
            "parameters": {
                "type": "object",
                "properties": {
                    "period_a": {"type": "string", "description": "First period, e.g. this_week"},
                    "period_b": {"type": "string", "description": "Second period, e.g. last_week"},
                },
                "required": ["period_a", "period_b"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "orders_summary",
            "description": "Get order count and revenue summary with status breakdown for a period.",
            "parameters": {
                "type": "object",
                "properties": {
                    "period": {"type": "string", "description": "Time period, e.g. this_month"},
                    "status": {"type": "string", "description": "Optional status filter"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "sales_by_category",
            "description": "Get sales volume and revenue grouped by category for a period.",
            "parameters": {
                "type": "object",
                "properties": {
                    "period": {"type": "string", "description": "Time period, e.g. this_month"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "product_info",
            "description": "Get details, price, current stock, and SKU for a named product.",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "Product name to search"},
                },
                "required": ["name"],
            },
        },
    },
]


def _call_groq_chatbot_tool(user_message: str) -> tuple[str | None, dict[str, Any]]:
    """Fallback: use Groq OpenAI-compatible function calling."""
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY.strip() == "":
        return None, {}
    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY.strip()}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are an e-commerce data assistant for this store. "
                        "Select the best tool to retrieve the exact figures. "
                        "If the question is unrelated to store data or cannot be answered by the available tools, "
                        "do not call any tool."
                    ),
                },
                {"role": "user", "content": user_message.strip()},
            ],
            "tools": GROQ_TOOLS,
            "tool_choice": "auto",
            "temperature": 0.0,
        }
        with httpx.Client(timeout=10.0) as http_client:
            resp = http_client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                msg = resp.json()["choices"][0]["message"]
                tool_calls = msg.get("tool_calls")
                if tool_calls:
                    tc = tool_calls[0]
                    fn_name = tc["function"]["name"]
                    args_val = tc["function"].get("arguments", "{}")
                    fn_args = json.loads(args_val) if isinstance(args_val, str) else args_val
                    if fn_name in CHAT_TOOL_REGISTRY:
                        return fn_name, fn_args or {}
    except Exception:
        pass
    return None, {}


def execute_chatbot_query(
    db: Any,
    store_id: int,
    user_message: str,
) -> dict[str, Any]:
    """Execute merchant chatbot query with multi-provider failover, caching, and strict honesty."""
    # Check 60-second cache
    cache_key = f"{store_id}:{hashlib.md5(user_message.strip().lower().encode()).hexdigest()}"
    now = time.time()
    if cache_key in _CHAT_CACHE:
        cached_time, cached_res = _CHAT_CACHE[cache_key]
        if now - cached_time < 60:
            return cached_res

    chosen_tool: str | None = None
    tool_params: dict[str, Any] = {}

    # 1. Primary: Google Gemini Function Calling
    client = get_gemini_client()
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
                    tools=GEMINI_CHATBOT_TOOLS,
                    temperature=0.0,
                ),
            )
            if response.function_calls:
                fn_call = response.function_calls[0]
                if fn_call.name in CHAT_TOOL_REGISTRY:
                    chosen_tool = fn_call.name
                    tool_params = dict(fn_call.args or {})
        except Exception:
            pass  # Fall back to Groq

    # 2. Secondary: Groq Function Calling
    if not chosen_tool:
        groq_tool, groq_params = _call_groq_chatbot_tool(user_message)
        if groq_tool:
            chosen_tool = groq_tool
            tool_params = groq_params

    # 3. Tertiary: Keyword heuristics (offline/local fallback)
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
