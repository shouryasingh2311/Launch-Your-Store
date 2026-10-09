import os
import random
import sys
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.orm import Session

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from app.auth import hash_password
from app.database import SessionLocal
from app.models import (
    Category,
    Order,
    OrderEvent,
    OrderItem,
    Product,
    Store,
    User,
)


DEMO_PRODUCTS = [
    # Candles
    {
        "cat": "Handmade Candles",
        "name": "Amber & Cedarwood Soy Candle",
        "price": Decimal("899.00"),
        "stock": 25,
        "sku": "CAND-001",
        "desc": "Hand-poured 100% natural soy wax candle with woody amber notes and wooden wick.",
        "img": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
    },
    {
        "cat": "Handmade Candles",
        "name": "Lavender Bliss Aromatherapy Candle",
        "price": Decimal("749.00"),
        "stock": 30,
        "sku": "CAND-002",
        "desc": "Pure French lavender essential oils blended with clean-burning coconut wax.",
        "img": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
    },
    {
        "cat": "Handmade Candles",
        "name": "Midnight Vanilla Pillar Candle",
        "price": Decimal("1099.00"),
        "stock": 3,  # Low stock
        "sku": "CAND-003",
        "desc": "Rich Bourbon vanilla and tonka bean pillar candle with 55h burn time.",
        "img": "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80",
    },
    # Ceramics
    {
        "cat": "Ceramic Tableware",
        "name": "Speckled Ceramic Coffee Mug",
        "price": Decimal("649.00"),
        "stock": 40,
        "sku": "CRM-001",
        "desc": "Studio handcrafted stoneware mug with rustic raw clay base and matte glaze.",
        "img": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    },
    {
        "cat": "Ceramic Tableware",
        "name": "Matte Black Ramen Bowl",
        "price": Decimal("1299.00"),
        "stock": 18,
        "sku": "CRM-002",
        "desc": "Wide-brim authentic stoneware ramen bowl fired at 1280°C for durability.",
        "img": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    },
    {
        "cat": "Ceramic Tableware",
        "name": "Terrazzo Coaster Set (4 pcs)",
        "price": Decimal("899.00"),
        "stock": 35,
        "sku": "CRM-003",
        "desc": "Cast stone and recycled marble chips with non-slip cork backing.",
        "img": "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80",
    },
    # Fragrances
    {
        "cat": "Organic Fragrances",
        "name": "Botanical Neroli Room Mist",
        "price": Decimal("999.00"),
        "stock": 20,
        "sku": "FRG-001",
        "desc": "Bright orange blossom and fresh green botanical room & linen freshener.",
        "img": "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80",
    },
    {
        "cat": "Organic Fragrances",
        "name": "Smoked Oud Reed Diffuser",
        "price": Decimal("1899.00"),
        "stock": 2,  # Low stock
        "sku": "FRG-002",
        "desc": "Alcohol-free long-lasting ambient scent diffuser with 8 rattan reeds.",
        "img": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
    },
    # Linen
    {
        "cat": "Artisanal Linen",
        "name": "Washed Linen Dinner Napkins (Set of 6)",
        "price": Decimal("1499.00"),
        "stock": 22,
        "sku": "LIN-001",
        "desc": "100% French flax linen napkins, pre-washed for effortless softness.",
        "img": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
    },
    {
        "cat": "Artisanal Linen",
        "name": "Boho Textured Cotton Throw Blanket",
        "price": Decimal("2899.00"),
        "stock": 14,
        "sku": "LIN-002",
        "desc": "Jacquard weave fringed throw blanket crafted from breathable organic cotton.",
        "img": "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=600&q=80",
    },
    {
        "cat": "Artisanal Linen",
        "name": "Handwoven Jute Table Runner",
        "price": Decimal("1199.00"),
        "stock": 28,
        "sku": "LIN-003",
        "desc": "Natural eco-friendly golden jute fibers hand-braided by rural artisans.",
        "img": "https://images.unsplash.com/photo-1528458907604-d3a3d5402ff7?auto=format&fit=crop&w=600&q=80",
    },
]

DEMO_CUSTOMERS = [
    ("Aarav Patel", "aarav.patel@gmail.com", "9820112345", "Bandra West, Mumbai 400050"),
    ("Priya Sharma", "priya.sharma@yahoo.com", "9811223344", "Indiranagar, Bengaluru 560038"),
    ("Rohan Gupta", "rohan.gupta@outlook.com", "9876543210", "Greater Kailash 1, New Delhi 110048"),
    ("Ananya Iyer", "ananya.iyer@gmail.com", "9741234567", "Jubilee Hills, Hyderabad 500033"),
    ("Vikram Malhotra", "vikram.m@gmail.com", "9900112233", "Alipore, Kolkata 700027"),
    ("Neha Verma", "neha.verma@gmail.com", "9823456789", "Koregaon Park, Pune 411001"),
    ("Kabir Mehta", "kabir.mehta@gmail.com", "9819876543", "Satellite, Ahmedabad 380015"),
    ("Aditi Rao", "aditi.rao@gmail.com", "9845012345", "Anna Nagar, Chennai 600040"),
    ("Karan Singhania", "karan.s@gmail.com", "9830123456", "Civil Lines, Jaipur 302006"),
    ("Ishaan Sen", "ishaan.sen@gmail.com", "9810987654", "Sector 15, Chandigarh 160015"),
]


def seed_demo_store():
    db: Session = SessionLocal()
    print("🚀 Seeding Launch-Your-Store demo environment...")

    try:
        # 1. Create or retrieve demo store
        store_slug = "demo-store"
        store = db.scalars(select(Store).where(Store.slug == store_slug)).first()

        if not store:
            store = Store(
                name="Aura Artisan Studio",
                slug=store_slug,
                business_type="Home Decor & Lifestyle",
                theme_id="elegant",
                content={
                    "tagline": "Timeless Handcrafted Luxury for Modern Living.",
                    "banner_text": "✨ Festive Offer: Flat 20% off on all artisanal handcrafted collections!",
                    "announcement_enabled": True,
                },
                theme_overrides={
                    "primary_color": "#8B5CF6",
                    "font_family": "Plus Jakarta Sans",
                    "accent_color": "#EC4899",
                },
            )
            db.add(store)
            db.flush()
            print(f"Created Store: {store.name} (slug: {store.slug}, id: {store.id})")
        else:
            store.name = "Aura Artisan Studio"
            store.theme_id = "elegant"
            store.content = {
                "tagline": "Timeless Handcrafted Luxury for Modern Living.",
                "banner_text": "✨ Festive Offer: Flat 20% off on all artisanal handcrafted collections!",
                "announcement_enabled": True,
            }
            db.flush()
            print(f"Found existing Store (id: {store.id})")

        # 2. Setup Owner and Staff accounts
        users_config = [
            ("owner@launchstore.com", "Password123", "owner"),
            ("staff@launchstore.com", "Password123", "staff"),
        ]

        for email, pwd, role in users_config:
            user = db.scalars(select(User).where(User.email == email)).first()
            if not user:
                user = User(
                    email=email,
                    password_hash=hash_password(pwd),
                    role=role,
                    store_id=store.id,
                )
                db.add(user)
                print(f"✅ Created {role.capitalize()} user: {email} / {pwd}")
            else:
                user.store_id = store.id
                user.role = role
                print(f"ℹ️ Updated user {email} (role: {role})")
        db.flush()

        # 3. Setup Categories
        existing_cats = {
            c.name: c for c in db.scalars(select(Category).where(Category.store_id == store.id)).all()
        }
        for item in DEMO_PRODUCTS:
            cat_name = item["cat"]
            if cat_name not in existing_cats:
                cat = Category(
                    store_id=store.id,
                    name=cat_name,
                    slug=cat_name.lower().replace(" ", "-"),
                )
                db.add(cat)
                db.flush()
                existing_cats[cat_name] = cat
        db.commit()
        print(f"Prepped {len(existing_cats)} categories")

        # 4. Setup Products
        existing_prods = {
            p.sku: p for p in db.scalars(select(Product).where(Product.store_id == store.id)).all()
        }
        product_objects = []
        for p_data in DEMO_PRODUCTS:
            sku = p_data["sku"]
            if sku in existing_prods:
                prod = existing_prods[sku]
                prod.price = p_data["price"]
                prod.stock = p_data["stock"]
                prod.description = p_data["desc"]
            else:
                prod = Product(
                    store_id=store.id,
                    category_id=existing_cats[p_data["cat"]].id,
                    name=p_data["name"],
                    description=p_data["desc"],
                    price=p_data["price"],
                    stock=p_data["stock"],
                    low_stock_threshold=5,
                    sku=sku,
                    image_url=p_data["img"],
                    is_active=True,
                )
                db.add(prod)
            product_objects.append(prod)

        db.commit()
        print(f"Seeded {len(product_objects)} products")

        # 5. Seed 35 Realistic Orders across the past 30 days
        existing_orders_count = db.scalars(
            select(Order).where(Order.store_id == store.id)
        ).all()

        if len(existing_orders_count) < 25:
            now = datetime.now(timezone.utc)
            statuses = ["delivered", "shipped", "packed", "placed"]

            for i in range(1, 36):
                # Spread dates over past 30 days
                days_ago = max(0, int(30 - (i * 0.85) + random.uniform(-1, 1)))
                order_dt = now - timedelta(days=days_ago, hours=random.randint(1, 12))

                # Assign realistic status according to recency
                if days_ago > 7:
                    status = "delivered"
                elif days_ago > 3:
                    status = "shipped"
                elif days_ago > 1:
                    status = "packed"
                else:
                    status = random.choice(["placed", "packed"])

                cust_name, cust_email, cust_phone, cust_address = random.choice(DEMO_CUSTOMERS)
                order_number = f"ORD-{1000 + i}"

                # 1 to 3 items per order
                num_items = random.choices([1, 2, 3], weights=[0.5, 0.35, 0.15])[0]
                selected_prods = random.sample(product_objects, num_items)

                subtotal = Decimal("0.00")
                order_items_to_add = []

                for prod in selected_prods:
                    qty = random.choices([1, 2], weights=[0.8, 0.2])[0]
                    line_price = prod.price * qty
                    subtotal += line_price
                    order_items_to_add.append(
                        OrderItem(
                            store_id=store.id,
                            product_id=prod.id,
                            name_snapshot=prod.name,
                            price_snapshot=prod.price,
                            qty=qty,
                        )
                    )

                shipping = Decimal("0.00") if subtotal >= 1500 else Decimal("99.00")
                total = subtotal + shipping

                order = Order(
                    store_id=store.id,
                    order_number=order_number,
                    customer_name=cust_name,
                    email=cust_email,
                    phone=cust_phone,
                    address=cust_address,
                    subtotal=subtotal,
                    discount=Decimal("0.00"),
                    shipping=shipping,
                    total=total,
                    status=status,
                    payment_method="UPI / Card (Mock)",
                    created_at=order_dt,
                    items=order_items_to_add,
                )
                db.add(order)
                db.flush()

                # Add timeline events
                db.add(
                    OrderEvent(
                        store_id=store.id,
                        order_id=order.id,
                        status="placed",
                        note="Customer placed order via online storefront.",
                        created_at=order_dt,
                    )
                )
                if status in ["packed", "shipped", "delivered"]:
                    db.add(
                        OrderEvent(
                            store_id=store.id,
                            order_id=order.id,
                            status="packed",
                            note="Order packed and handed to courier partner.",
                            created_at=order_dt + timedelta(hours=8),
                        )
                    )
                if status in ["shipped", "delivered"]:
                    db.add(
                        OrderEvent(
                            store_id=store.id,
                            order_id=order.id,
                            status="shipped",
                            note="Dispatched via BlueDart Express (Track: BLU-928174).",
                            created_at=order_dt + timedelta(days=1),
                        )
                    )
                if status == "delivered":
                    db.add(
                        OrderEvent(
                            store_id=store.id,
                            order_id=order.id,
                            status="delivered",
                            note="Delivered and signature received from recipient.",
                            created_at=order_dt + timedelta(days=3),
                        )
                    )

            db.commit()
            print("✅ Successfully seeded 35 realistic orders spanning 30 days!")
        else:
            print(f"ℹ️ Store already has {len(existing_orders_count)} orders, skipping order re-generation.")

        db.commit()
        print("\n🎉 Demo environment seeding complete!")
        print("--------------------------------------------------")
        print("Store URL:        http://localhost:5173/public/demo-store")
        print("Merchant Owner:   owner@launchstore.com / Password123")
        print("Merchant Staff:   staff@launchstore.com / Password123")
        print("--------------------------------------------------")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding demo store: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import time

    max_attempts = 4
    for attempt in range(1, max_attempts + 1):
        try:
            seed_demo_store()
            break
        except Exception as exc:
            if attempt == max_attempts:
                print(f"All {max_attempts} attempts failed.")
                raise
            print(f"Attempt {attempt} encountered network/db issue: {exc}. Retrying in 2s...")
            time.sleep(2.0)
