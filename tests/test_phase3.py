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
        json={"name": f"{name_prefix} {slug}", "slug": slug, "business_type": "Retail"},
        headers=headers,
    )
    return headers, slug, email


def test_merchant_product_crud():
    headers, slug, _ = setup_merchant_and_store("Tech")

    # 1. Create product with variant
    payload = {
        "name": "Wireless Mechanical Keyboard",
        "description": "Compact 75% hot-swappable keyboard",
        "price": 3499.00,
        "compare_at_price": 4499.00,
        "discount_pct": 22,
        "stock": 15,
        "sku": "KB-75-W",
        "variants": [
            {"name": "Gateron Brown", "sku": "KB-75-BRN", "price_delta": 0.0, "stock": 10},
            {"name": "Gateron Red", "sku": "KB-75-RED", "price_delta": 100.0, "stock": 5},
        ],
    }
    create_res = client.post("/products", json=payload, headers=headers)
    assert create_res.status_code == 201
    prod = create_res.json()
    assert prod["name"] == "Wireless Mechanical Keyboard"
    assert prod["stock"] == 15
    assert len(prod["variants"]) == 2
    prod_id = prod["id"]

    # 2. Get product
    get_res = client.get(f"/products/{prod_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["sku"] == "KB-75-W"

    # 3. Update product
    update_res = client.patch(f"/products/{prod_id}", json={"stock": 20, "price": 3299.00}, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["stock"] == 20
    assert update_res.json()["price"] == 3299.00

    # 4. List products
    list_res = client.get("/products", headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # 5. Bulk update
    bulk_res = client.post(
        "/products/bulk",
        json={"product_ids": [prod_id], "stock": 25},
        headers=headers,
    )
    assert bulk_res.status_code == 200
    assert bulk_res.json()["updated_count"] == 1

    check_res = client.get(f"/products/{prod_id}", headers=headers)
    assert check_res.json()["stock"] == 25

    # 6. Delete product
    del_res = client.delete(f"/products/{prod_id}", headers=headers)
    assert del_res.status_code == 200
    assert client.get(f"/products/{prod_id}", headers=headers).status_code == 404


def test_public_storefront_and_checkout_flow():
    headers, slug, _ = setup_merchant_and_store("Fashion")

    # Seed 2 products
    p1_res = client.post(
        "/products",
        json={"name": "Linen Summer Shirt", "price": 1499.00, "stock": 10, "sku": "FSH-SHR"},
        headers=headers,
    )
    p2_res = client.post(
        "/products",
        json={"name": "Leather Chelsea Boots", "price": 2999.00, "stock": 5, "sku": "FSH-BOT"},
        headers=headers,
    )
    p1_id = p1_res.json()["id"]
    p2_id = p2_res.json()["id"]

    # 1. Public store view (no auth)
    store_res = client.get(f"/public/{slug}")
    assert store_res.status_code == 200
    assert store_res.json()["slug"] == slug

    # 2. Public products list (no auth)
    prods_res = client.get(f"/public/{slug}/products?sort=price_asc")
    assert prods_res.status_code == 200
    items = prods_res.json()["products"]
    assert len(items) >= 2
    assert items[0]["price"] <= items[1]["price"]

    # 3. Public single product view
    single_res = client.get(f"/public/{slug}/products/{p1_id}")
    assert single_res.status_code == 200
    assert single_res.json()["name"] == "Linen Summer Shirt"

    # 4. Out of stock order attempt must fail (400)
    fail_order = client.post(
        f"/public/{slug}/orders",
        json={
            "customer_name": "Aarav Sharma",
            "email": "aarav@example.com",
            "items": [{"product_id": p1_id, "qty": 999}],
        },
    )
    assert fail_order.status_code == 400
    assert "Insufficient stock" in fail_order.json()["detail"]

    # 5. Place valid order
    order_res = client.post(
        f"/public/{slug}/orders",
        json={
            "customer_name": "Aarav Sharma",
            "email": "aarav@example.com",
            "phone": "+91 9988776655",
            "address": "Bandra West, Mumbai",
            "items": [
                {"product_id": p1_id, "qty": 2},
                {"product_id": p2_id, "qty": 1},
            ],
        },
    )
    assert order_res.status_code == 201
    order_data = order_res.json()
    assert order_data["status"] == "placed"
    assert "ORD-" in order_data["order_number"]
    assert order_data["subtotal"] == (1499.00 * 2) + 2999.00
    order_number = order_data["order_number"]

    # 6. Verify stock decremented
    p1_check = client.get(f"/public/{slug}/products/{p1_id}").json()
    assert p1_check["stock"] == 8  # 10 - 2 = 8

    # 7. Track order by customer email
    track_res = client.get(f"/public/{slug}/orders/{order_number}?email=aarav@example.com")
    assert track_res.status_code == 200
    assert track_res.json()["order_number"] == order_number

    # Wrong email rejected (404)
    bad_track = client.get(f"/public/{slug}/orders/{order_number}?email=hacker@example.com")
    assert bad_track.status_code == 404

    # 8. Merchant order view & status management
    merchant_orders = client.get("/orders", headers=headers)
    assert merchant_orders.status_code == 200
    assert len(merchant_orders.json()) >= 1

    order_id = order_data["id"]
    status_update = client.patch(
        f"/orders/{order_id}/status",
        json={"status": "shipped", "note": "Handed over to Blue Dart Express."},
        headers=headers,
    )
    assert status_update.status_code == 200
    assert status_update.json()["status"] == "shipped"
    events = status_update.json()["events"]
    assert len(events) >= 2  # placed + shipped


def test_cross_tenant_isolation_guard():
    # Merchant A
    headers_a, slug_a, _ = setup_merchant_and_store("StoreA")
    prod_a = client.post(
        "/products",
        json={"name": "Store A Exclusive", "price": 999.00, "stock": 5},
        headers=headers_a,
    ).json()

    # Merchant B
    headers_b, slug_b, _ = setup_merchant_and_store("StoreB")

    # Merchant B tries to view or update Merchant A's product -> 404
    assert client.get(f"/products/{prod_a['id']}", headers=headers_b).status_code == 404
    assert client.patch(f"/products/{prod_a['id']}", json={"price": 1.0}, headers=headers_b).status_code == 404
    assert client.delete(f"/products/{prod_a['id']}", headers=headers_b).status_code == 404
