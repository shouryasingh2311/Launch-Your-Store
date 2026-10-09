import uuid
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def setup_tenant(store_prefix: str = "Tenant"):
    email = f"{store_prefix.lower()}_{uuid.uuid4().hex[:8]}@example.com"
    signup = client.post("/auth/signup", json={"email": email, "password": "Password123"})
    token = signup.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    slug = f"store-{uuid.uuid4().hex[:8]}"
    client.post(
        "/stores",
        json={"name": f"{store_prefix} Store", "slug": slug, "business_type": "Retail"},
        headers=headers,
    )
    return headers, slug, email


def test_cross_tenant_isolation_and_no_existence_leak():
    """Verify Tenant B cannot access or modify Tenant A resources, and gets 404 (not 403) to prevent existence leakage."""
    headers_a, slug_a, _ = setup_tenant("Alpha")
    headers_b, slug_b, _ = setup_tenant("Beta")

    # 1. Tenant A creates a product
    prod_a = client.post(
        "/products",
        json={"name": "Alpha Secret Product", "price": 4999.00, "stock": 20},
        headers=headers_a,
    ).json()
    prod_a_id = prod_a["id"]

    # 2. Shopper places order in Store Alpha
    order_a = client.post(
        f"/public/{slug_a}/orders",
        json={
            "customer_name": "John Doe",
            "email": "john@example.com",
            "items": [{"product_id": prod_a_id, "qty": 1}],
        },
    ).json()
    order_a_id = order_a["id"]

    # --- Cross-tenant attempts by Tenant B ---

    # B tries to GET A's product -> 404
    res = client.get(f"/products/{prod_a_id}", headers=headers_b)
    assert res.status_code == 404, f"Expected 404 to prevent leak, got {res.status_code}"

    # B tries to PATCH A's product -> 404
    res = client.patch(
        f"/products/{prod_a_id}",
        json={"name": "Hacked by Beta", "price": 1.00},
        headers=headers_b,
    )
    assert res.status_code == 404

    # B tries to DELETE A's product -> 404
    res = client.delete(f"/products/{prod_a_id}", headers=headers_b)
    assert res.status_code == 404

    # B tries to GET A's order -> 404
    res = client.get(f"/orders/{order_a_id}", headers=headers_b)
    assert res.status_code == 404

    # B tries to update A's order status -> 404
    res = client.patch(
        f"/orders/{order_a_id}/status",
        json={"status": "cancelled", "note": "Malicious cancellation"},
        headers=headers_b,
    )
    assert res.status_code == 404

    # Verify A's product remains untouched
    original_prod = client.get(f"/products/{prod_a_id}", headers=headers_a).json()
    assert original_prod["name"] == "Alpha Secret Product"


def test_staff_role_privilege_boundaries():
    """Verify Staff users can read products/orders but are strictly blocked from store settings and team management."""
    headers_owner, slug, _ = setup_tenant("OwnerStore")

    # Invite staff member
    staff_email = f"staff_{uuid.uuid4().hex[:8]}@example.com"
    team_invite = client.post(
        "/team",
        json={"email": staff_email, "password": "Password123", "role": "staff"},
        headers=headers_owner,
    )
    assert team_invite.status_code == 201

    # Login as staff
    staff_login = client.post("/auth/login", json={"email": staff_email, "password": "Password123"}).json()
    headers_staff = {"Authorization": f"Bearer {staff_login['access_token']}"}

    # 1. Staff CAN view products and dashboard
    assert client.get("/products", headers=headers_staff).status_code == 200
    assert client.get("/dashboard/summary", headers=headers_staff).status_code == 200

    # 2. Staff CANNOT update store settings (returns 404 to prevent existence leakage)
    res = client.patch(
        "/stores/me",
        json={"name": "Staff Renamed Store"},
        headers=headers_staff,
    )
    assert res.status_code == 404

    # 3. Staff CANNOT update store theme (returns 404 to prevent existence leakage)
    res = client.patch(
        "/stores/me/theme",
        json={"theme_id": "dark"},
        headers=headers_staff,
    )
    assert res.status_code == 404

    # 4. Staff CANNOT invite team members (returns 404 to prevent existence leakage)
    res = client.post(
        "/team",
        json={"email": "another@example.com", "password": "Password123", "role": "staff"},
        headers=headers_staff,
    )
    assert res.status_code == 404


def test_stock_exhaustion_and_atomic_decrements():
    """Verify stock is strictly validated: ordering more than available stock is rejected with 400."""
    headers, slug, _ = setup_tenant("StockStore")

    prod = client.post(
        "/products",
        json={"name": "Limited Edition Watch", "price": 9999.00, "stock": 2},
        headers=headers,
    ).json()
    prod_id = prod["id"]

    # 1. Try to order 3 units when only 2 exist -> 400
    res = client.post(
        f"/public/{slug}/orders",
        json={
            "customer_name": "Greedy Buyer",
            "email": "buyer@example.com",
            "items": [{"product_id": prod_id, "qty": 3}],
        },
    )
    assert res.status_code == 400
    assert "insufficient stock" in res.json()["detail"].lower()

    # 2. Order 2 units -> 201 success
    res_ok = client.post(
        f"/public/{slug}/orders",
        json={
            "customer_name": "Valid Buyer",
            "email": "buyer@example.com",
            "items": [{"product_id": prod_id, "qty": 2}],
        },
    )
    assert res_ok.status_code == 201

    # 3. Now stock is 0; order 1 unit -> 400
    res_zero = client.post(
        f"/public/{slug}/orders",
        json={
            "customer_name": "Late Buyer",
            "email": "late@example.com",
            "items": [{"product_id": prod_id, "qty": 1}],
        },
    )
    assert res_zero.status_code == 400


def test_negative_payload_validations():
    """Verify standard schema validation rules on edge cases."""
    # 1. Short password (< 8 chars) -> 422
    res = client.post("/auth/signup", json={"email": "valid@example.com", "password": "short"})
    assert res.status_code == 422

    # 2. Invalid order status transition payload -> 422
    headers, slug, _ = setup_tenant("PayloadStore")
    res = client.patch(
        "/orders/99999/status",
        json={"status": "invalid_status_enum"},
        headers=headers,
    )
    assert res.status_code == 422

    # 3. Unauthenticated access to merchant endpoints -> 401
    assert client.get("/products").status_code == 401
    assert client.get("/dashboard/summary").status_code == 401
    assert client.get("/stores/me").status_code == 401
