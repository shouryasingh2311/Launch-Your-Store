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


def test_dashboard_metrics_and_revenue_series():
    headers, slug, _ = setup_merchant_and_store("Analytics")

    # 1. Create product with low stock
    prod = client.post(
        "/products",
        json={
            "name": "Smart Watch Pro",
            "price": 2500.00,
            "stock": 3,  # <= low_stock_threshold (5)
            "low_stock_threshold": 5,
        },
        headers=headers,
    ).json()

    # 2. Place order as shopper
    order_res = client.post(
        f"/public/{slug}/orders",
        json={
            "customer_name": "Rohan Gupta",
            "email": "rohan@example.com",
            "items": [{"product_id": prod["id"], "qty": 1}],
        },
    )
    assert order_res.status_code == 201

    # 3. Check Dashboard Summary KPIs
    summary_res = client.get("/dashboard/summary", headers=headers)
    assert summary_res.status_code == 200
    summary = summary_res.json()
    assert summary["total_orders"] == 1
    assert summary["total_revenue"] >= 2500.00
    assert summary["average_order_value"] >= 2500.00
    assert summary["low_stock_count"] >= 1
    assert summary["pending_orders_count"] == 1

    # 4. Check Revenue Series (14 days)
    series_res = client.get("/dashboard/revenue-series?days=14", headers=headers)
    assert series_res.status_code == 200
    series = series_res.json()
    assert len(series) == 14
    # Total revenue in series should equal or exceed our placed order
    total_in_series = sum(p["revenue"] for p in series)
    assert total_in_series >= 2500.00

    # 5. Check Activity Feed
    activity_res = client.get("/dashboard/activity", headers=headers)
    assert activity_res.status_code == 200
    activities = activity_res.json()
    assert len(activities) >= 1
    types = [a["type"] for a in activities]
    assert "order" in types


def test_store_settings_customization():
    headers, slug, _ = setup_merchant_and_store("Custom")

    # 1. Update Profile (PATCH /stores/me)
    profile_update = client.patch(
        "/stores/me",
        json={
            "name": "Updated Boutique",
            "phone": "+91 9123456789",
            "address": "Koramangala, Bengaluru",
            "logo_url": "https://example.com/logo.png",
        },
        headers=headers,
    )
    assert profile_update.status_code == 200
    assert profile_update.json()["name"] == "Updated Boutique"
    assert profile_update.json()["phone"] == "+91 9123456789"

    # 2. Update Theme (PATCH /stores/me/theme)
    theme_update = client.patch(
        "/stores/me/theme",
        json={
            "theme_id": "vibrant",
            "theme_overrides": {
                "--primary": "#ec4899",
                "--radius": "16px",
            },
        },
        headers=headers,
    )
    assert theme_update.status_code == 200
    assert theme_update.json()["theme_id"] == "vibrant"
    assert theme_update.json()["theme_overrides"]["--primary"] == "#ec4899"

    # 3. Update Content (PATCH /stores/me/content)
    content_update = client.patch(
        "/stores/me/content",
        json={
            "content": {
                "hero_title": "Grand Festive Sale!",
                "announcement": "50% off sitewide today only",
                "footer_text": "Crafted with passion in India.",
            }
        },
        headers=headers,
    )
    assert content_update.status_code == 200
    assert content_update.json()["content"]["hero_title"] == "Grand Festive Sale!"

    # 4. Verify public storefront displays all updated settings
    public_res = client.get(f"/public/{slug}")
    assert public_res.status_code == 200
    pub_data = public_res.json()
    assert pub_data["name"] == "Updated Boutique"
    assert pub_data["theme_id"] == "vibrant"
    assert pub_data["content"]["hero_title"] == "Grand Festive Sale!"


def test_team_management_and_role_guards():
    owner_headers, slug, _ = setup_merchant_and_store("TeamTest")

    staff_email = f"staff_{uuid.uuid4().hex[:8]}@example.com"
    staff_password = "StaffPassword123"

    # 1. Owner invites staff member
    invite_res = client.post(
        "/team",
        json={"email": staff_email, "password": staff_password},
        headers=owner_headers,
    )
    assert invite_res.status_code == 201
    assert invite_res.json()["role"] == "staff"

    # 2. Staff logs in
    login_res = client.post(
        "/auth/login",
        json={"email": staff_email, "password": staff_password},
    )
    assert login_res.status_code == 200
    staff_token = login_res.json()["access_token"]
    staff_headers = {"Authorization": f"Bearer {staff_token}"}

    # 3. Staff CAN view team and dashboard
    team_list = client.get("/team", headers=staff_headers)
    assert team_list.status_code == 200
    assert len(team_list.json()) >= 2  # owner + staff

    dash_res = client.get("/dashboard/summary", headers=staff_headers)
    assert dash_res.status_code == 200

    # 4. Staff CANNOT invite other staff (404 not found to prevent leaking)
    illegal_invite = client.post(
        "/team",
        json={"email": "other@example.com", "password": "Password123"},
        headers=staff_headers,
    )
    assert illegal_invite.status_code == 404

    # 5. Staff CANNOT edit theme or content (404)
    illegal_theme = client.patch(
        "/stores/me/theme",
        json={"theme_id": "minimal"},
        headers=staff_headers,
    )
    assert illegal_theme.status_code == 404

    illegal_content = client.patch(
        "/stores/me/content",
        json={"content": {"hero": "hacked"}},
        headers=staff_headers,
    )
    assert illegal_content.status_code == 404
