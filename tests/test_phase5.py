import io
import uuid
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def setup_merchant_and_store(name_prefix: str = "Store"):
    email = f"merchant_{uuid.uuid4().hex[:8]}@example.com"
    signup = client.post("/auth/signup", json={"email": email, "password": "Password123"})
    token = signup.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    slug = f"shop-{uuid.uuid4().hex[:8]}"
    client.post(
        "/stores",
        json={"name": f"{name_prefix} {slug}", "slug": slug, "business_type": "Electronics"},
        headers=headers,
    )
    return headers, slug, email


def test_csv_template_download():
    res = client.get("/import/template")
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
    assert "name,description,price,stock,category,sku,image_url" in res.text


def test_csv_preview_and_fuzzy_mapping():
    headers, slug, _ = setup_merchant_and_store("PreviewStore")

    csv_data = (
        'Item Name,Details,Cost,Quantity,Product Category,Bar Code\n'
        'Gaming Mouse,RGB Wireless Mouse,"₹1,499.00",25,Electronics,GM-001\n'
        'Mechanical Keyboard,Brown Switches,"₹3,999.00",10,Electronics,KB-002\n'
    )
    file = io.BytesIO(csv_data.encode("utf-8"))

    res = client.post(
        "/import/preview",
        files={"file": ("inventory.csv", file, "text/csv")},
        headers=headers,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["total_rows"] == 2
    assert "Item Name" in data["headers"]
    # Verify fuzzy column mapping mapped original headers to canonical keys
    mapping = data["column_mapping"]
    assert mapping.get("Item Name") == "name"
    assert mapping.get("Cost") == "price"
    assert mapping.get("Quantity") == "stock"
    assert mapping.get("Product Category") == "category"
    assert mapping.get("Bar Code") == "sku"


def test_csv_validation_with_currency_cleaning_and_errors():
    headers, slug, _ = setup_merchant_and_store("ValidateStore")

    # Row 1 is valid with currency symbols (Rs. 899.50)
    # Row 2 is invalid: price is missing/string, stock is invalid
    csv_data = (
        'name,description,price,stock,category,sku\n'
        'Desk Lamp,LED Warm Light,Rs. 899.50,15,Home Decor,DL-1\n'
        ',Missing Name,Free,invalid_stock,Home Decor,DL-2\n'
    )
    file = io.BytesIO(csv_data.encode("utf-8"))

    res = client.post(
        "/import/validate",
        files={"file": ("test.csv", file, "text/csv")},
        headers=headers,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["total_rows"] == 2
    assert data["valid_rows"] == 1
    assert data["invalid_rows"] == 1
    assert len(data["errors"]) >= 1
    assert data["errors"][0]["row"] == 3  # Line 3 (1-indexed header + row 1)


def test_csv_commit_imports_products():
    headers, slug, _ = setup_merchant_and_store("CommitStore")

    csv_data = (
        'name,description,price,stock,category,sku\n'
        'Silk Saree,Handloom pure silk,"₹4,500.00",8,Ethnic Wear,SK-01\n'
        'Linen Shirt,Slim fit breathable,"₹1,299.00",20,Ethnic Wear,LN-02\n'
    )
    file = io.BytesIO(csv_data.encode("utf-8"))

    res = client.post(
        "/import/commit",
        files={"file": ("clothes.csv", file, "text/csv")},
        data={"auto_create_categories": "true"},
        headers=headers,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["imported_count"] == 2
    assert data["skipped_count"] == 0

    # Verify products are live in merchant catalog
    prods = client.get("/products", headers=headers).json()
    assert len(prods) == 2
    names = [p["name"] for p in prods]
    assert "Silk Saree" in names
    assert "Linen Shirt" in names
    # Verify Ethnic Wear category was auto-created
    cats = client.get("/stores/me/categories", headers=headers).json()
    assert any(c["name"] == "Ethnic Wear" for c in cats)


def test_ai_setup_suggestions():
    res = client.post(
        "/ai/setup-suggestions",
        json={"description": "We handcraft organic scented soy candles and botanical room mists in Mumbai"},
    )
    assert res.status_code == 200
    data = res.json()
    assert len(data["categories"]) >= 3
    assert isinstance(data["tagline"], str) and len(data["tagline"]) > 0
    assert data["theme_id"] in ["minimal", "modern", "bold", "warm", "dark", "playful", "elegant"]


def test_chat_tool_direct_execution():
    headers, slug, _ = setup_merchant_and_store("ChatToolStore")

    # Seed product
    prod = client.post(
        "/products",
        json={"name": "Bluetooth Speaker", "price": 1999.00, "stock": 2, "low_stock_threshold": 5},
        headers=headers,
    ).json()

    # Place order
    client.post(
        f"/public/{slug}/orders",
        json={
            "customer_name": "Aarav Shah",
            "email": "aarav@example.com",
            "items": [{"product_id": prod["id"], "qty": 1}],
        },
    )

    # 1. Direct tool: top_products
    top_res = client.post(
        "/chat/tool",
        json={"tool": "top_products", "params": {"limit": 5}},
        headers=headers,
    )
    assert top_res.status_code == 200
    top_data = top_res.json()
    assert top_data["tool"] == "top_products"
    assert "Bluetooth Speaker" in top_data["answer"]
    assert top_data["table"] is not None
    assert "Product Name" in top_data["table"]["columns"]

    # 2. Direct tool: low_stock
    low_res = client.post(
        "/chat/tool",
        json={"tool": "low_stock", "params": {}},
        headers=headers,
    )
    assert low_res.status_code == 200
    low_data = low_res.json()
    assert "low stock" in low_data["answer"].lower()
    assert low_data["table"] is not None
    assert "Bluetooth Speaker" in low_data["table"]["rows"][0][0]

    # 3. Direct tool: orders_summary
    orders_res = client.post(
        "/chat/tool",
        json={"tool": "orders_summary", "params": {"days": 30}},
        headers=headers,
    )
    assert orders_res.status_code == 200

    # 4. Direct tool: unknown tool rejection
    err_res = client.post(
        "/chat/tool",
        json={"tool": "non_existent_tool", "params": {}},
        headers=headers,
    )
    assert err_res.status_code == 400


def test_chat_assistant_message_flow():
    headers, slug, _ = setup_merchant_and_store("ChatFlowStore")

    # Seed product
    client.post(
        "/products",
        json={"name": "Noise Cancelling Headphones", "price": 4999.00, "stock": 1, "low_stock_threshold": 3},
        headers=headers,
    )

    # Question about low stock
    chat_res = client.post(
        "/chat",
        json={"message": "Which items are running low on stock?"},
        headers=headers,
    )
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert "low stock" in chat_data["answer"].lower()
    assert chat_data["tool"] == "low_stock"
    assert chat_data["table"] is not None
    assert "Noise Cancelling Headphones" in chat_data["table"]["rows"][0][0]

    # Irrelevant / unsupported question
    off_topic = client.post(
        "/chat",
        json={"message": "Who won the 1998 football World Cup?"},
        headers=headers,
    )
    assert off_topic.status_code == 200
    assert "data" in off_topic.json()["answer"].lower() or "store" in off_topic.json()["answer"].lower()
