import uuid
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def get_unique_email() -> str:
    return f"tester_{uuid.uuid4().hex[:8]}@example.com"


def get_unique_slug() -> str:
    return f"shop-{uuid.uuid4().hex[:8]}"


def test_auth_signup_validation_and_login():
    email = get_unique_email()
    password = "StrongPassword123"

    # Password less than 8 characters must fail validation (422)
    short_res = client.post("/auth/signup", json={"email": email, "password": "short"})
    assert short_res.status_code == 422

    # Successful signup (201)
    signup_res = client.post("/auth/signup", json={"email": email, "password": password})
    assert signup_res.status_code == 201
    data = signup_res.json()
    assert "access_token" in data
    assert data["user"]["email"] == email
    assert data["user"]["role"] == "owner"
    token = data["access_token"]

    # Duplicate signup must fail (400)
    dup_res = client.post("/auth/signup", json={"email": email, "password": password})
    assert dup_res.status_code == 400

    # Successful login (200)
    login_res = client.post("/auth/login", json={"email": email, "password": password})
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # Wrong password fails (401)
    bad_login = client.post("/auth/login", json={"email": email, "password": "WrongPassword"})
    assert bad_login.status_code == 401

    # /auth/me returns current profile
    me_res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["user"]["email"] == email


def test_slug_availability():
    unique_slug = get_unique_slug()

    # Valid slug is available
    res = client.get(f"/slug-available?slug={unique_slug}")
    assert res.status_code == 200
    assert res.json()["is_available"] is True

    # Bad slug format fails
    bad_res = client.get("/slug-available?slug=bad_slug_with_underscores!")
    assert bad_res.status_code == 400


def test_store_creation_flow():
    email = get_unique_email()
    signup_res = client.post("/auth/signup", json={"email": email, "password": "Password123"})
    token = signup_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    slug = get_unique_slug()
    store_payload = {
        "name": "Artisan Craft Studio",
        "slug": slug,
        "business_type": "Home Decor",
        "contact_email": email,
        "phone": "+91 9876543210",
        "address": "Connaught Place, New Delhi",
    }

    # Create store (201)
    create_res = client.post("/stores", json=store_payload, headers=headers)
    assert create_res.status_code == 201
    store_data = create_res.json()
    assert store_data["slug"] == slug
    assert store_data["name"] == "Artisan Craft Studio"

    # Slug should now be unavailable
    check_res = client.get(f"/slug-available?slug={slug}")
    assert check_res.json()["is_available"] is False

    # Get my store (200)
    my_store_res = client.get("/stores/me", headers=headers)
    assert my_store_res.status_code == 200
    assert my_store_res.json()["id"] == store_data["id"]


def test_categories_and_dummy_import():
    email = get_unique_email()
    signup_res = client.post("/auth/signup", json={"email": email, "password": "Password123"})
    token = signup_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Predefined categories returns all 8 categories
    pre_res = client.get("/categories/predefined")
    assert pre_res.status_code == 200
    categories = pre_res.json()
    assert len(categories) == 8
    cat_names = [c["name"] for c in categories]
    assert "Fashion" in cat_names
    assert "Electronics" in cat_names
    assert "Jewellery" in cat_names

    # 2. Create store
    slug = get_unique_slug()
    client.post(
        "/stores",
        json={"name": "Quick Mart", "slug": slug, "business_type": "Retail"},
        headers=headers,
    )

    # 3. Add custom categories
    batch_cat_res = client.post(
        "/stores/me/categories",
        json={
            "categories": [
                {"name": "Fashion", "slug": "fashion"},
                {"name": "Electronics", "slug": "electronics"},
            ]
        },
        headers=headers,
    )
    assert batch_cat_res.status_code == 201
    assert len(batch_cat_res.json()) >= 2

    # 4. Import dummy products
    import_res = client.post("/stores/me/import-dummy", json={}, headers=headers)
    assert import_res.status_code == 200
    data = import_res.json()
    assert data["status"] == "success"
    assert data["imported_products"] > 0
    assert "Fashion" in data["imported_categories"] or "Electronics" in data["imported_categories"]


def test_unauthenticated_guard():
    # Protected routes must return 401 without Bearer token
    assert client.get("/stores/me").status_code == 401
    assert client.post("/stores", json={"name": "Test", "slug": "test"}).status_code == 401
    assert client.post("/stores/me/import-dummy", json={}).status_code == 401
