from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Category, Notification, Order, OrderEvent, OrderItem, Product, Store
from app.schemas import (
    EmailType,
    OrderCreateRequest,
    OrderResponse,
    ProductResponse,
    PublicProductListResponse,
    PublicStoreResponse,
)

router = APIRouter(prefix="/public", tags=["Public Storefront (Shopper)"])


@router.get("/{slug}", response_model=PublicStoreResponse)
def get_public_store(slug: str, db: Session = Depends(get_db)) -> PublicStoreResponse:
    """Retrieve public store configuration, theme, content, and categories by URL slug."""
    clean_slug = slug.strip().lower()
    store = db.scalar(
        select(Store)
        .options(joinedload(Store.categories))
        .where(Store.slug == clean_slug)
    )
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Store '{clean_slug}' not found.",
        )
    return PublicStoreResponse.model_validate(store)


@router.get("/{slug}/products", response_model=PublicProductListResponse)
def list_public_products(
    slug: str,
    category: str | None = None,
    q: str | None = None,
    min: float | None = Query(None, ge=0),
    max: float | None = Query(None, ge=0),
    sort: str = Query("newest", pattern=r"^(newest|price_asc|price_desc)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(24, ge=1, le=100),
    db: Session = Depends(get_db),
) -> PublicProductListResponse:
    """Public shopper product catalogue with category filter, search, price range, and sorting."""
    clean_slug = slug.strip().lower()
    store = db.scalar(select(Store).where(Store.slug == clean_slug))
    if not store:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    query = (
        select(Product)
        .options(joinedload(Product.category), joinedload(Product.variants))
        .where(Product.store_id == store.id, Product.is_active.is_(True))
    )

    # Filter by category slug or name
    if category:
        cat_filter = category.strip().lower()
        query = query.join(Product.category).where(
            or_(
                func.lower(Category.slug) == cat_filter,
                func.lower(Category.name) == cat_filter,
            )
        )

    # Search keyword
    if q:
        search_filter = f"%{q.strip().lower()}%"
        query = query.where(
            or_(
                func.lower(Product.name).like(search_filter),
                func.lower(Product.description).like(search_filter),
            )
        )

    # Price range
    if min is not None:
        query = query.where(Product.price >= Decimal(str(min)))
    if max is not None:
        query = query.where(Product.price <= Decimal(str(max)))

    # Count total matching products
    count_query = select(func.count()).select_from(query.subquery())
    total = db.scalar(count_query) or 0

    # Sorting
    if sort == "price_asc":
        query = query.order_by(Product.price.asc(), Product.id.desc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc(), Product.id.desc())
    else:  # newest
        query = query.order_by(Product.id.desc())

    offset = (page - 1) * limit
    products = db.scalars(query.offset(offset).limit(limit)).unique().all()

    return PublicProductListResponse(
        total=total,
        page=page,
        limit=limit,
        products=[ProductResponse.model_validate(p) for p in products],
    )


@router.get("/{slug}/products/{product_id}", response_model=ProductResponse)
def get_public_product(slug: str, product_id: int, db: Session = Depends(get_db)) -> ProductResponse:
    """Retrieve single public product with variant options."""
    clean_slug = slug.strip().lower()
    store = db.scalar(select(Store).where(Store.slug == clean_slug))
    if not store:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    product = db.scalar(
        select(Product)
        .options(joinedload(Product.category), joinedload(Product.variants))
        .where(
            Product.id == product_id,
            Product.store_id == store.id,
            Product.is_active.is_(True),
        )
    )
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    return ProductResponse.model_validate(product)


@router.post("/{slug}/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_public_order(
    slug: str,
    data: OrderCreateRequest,
    db: Session = Depends(get_db),
) -> OrderResponse:
    """Place a shopper order: validates stock, decrements inventory atomically, and creates receipt."""
    clean_slug = slug.strip().lower()
    store = db.scalar(select(Store).where(Store.slug == clean_slug))
    if not store:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    # 1. Fetch and validate all products & stock
    product_ids = [item.product_id for item in data.items]
    products = db.scalars(
        select(Product).where(Product.id.in_(product_ids), Product.store_id == store.id)
    ).all()
    product_map = {p.id: p for p in products}

    subtotal = Decimal("0.00")
    order_items_to_create = []

    for item in data.items:
        product = product_map.get(item.product_id)
        if not product or not product.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with ID {item.product_id} is unavailable.",
            )

        # Stock check
        if product.stock < item.qty:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product.name}'. Requested: {item.qty}, Available: {product.stock}.",
            )

        # Atomic stock decrement
        product.stock -= item.qty

        item_total = product.price * item.qty
        subtotal += item_total

        order_items_to_create.append(
            {
                "product_id": product.id,
                "variant_id": item.variant_id,
                "name_snapshot": product.name,
                "price_snapshot": product.price,
                "qty": item.qty,
            }
        )

    # Shipping rule: Free shipping on orders over ₹499, else ₹50 flat
    shipping = Decimal("0.00") if subtotal >= Decimal("499.00") else Decimal("50.00")
    discount = Decimal("0.00")
    total = subtotal - discount + shipping

    # 2. Generate per-store sequential order number (ORD-1001, ORD-1002, ...)
    order_count = db.scalar(
        select(func.count(Order.id)).where(Order.store_id == store.id)
    ) or 0
    order_number = f"ORD-{1001 + order_count}"

    # 3. Create Order
    new_order = Order(
        store_id=store.id,
        order_number=order_number,
        customer_name=data.customer_name,
        email=data.email,
        phone=data.phone,
        address=data.address,
        subtotal=subtotal,
        discount=discount,
        shipping=shipping,
        total=total,
        status="placed",
        payment_method=data.payment_method,
    )
    db.add(new_order)
    db.flush()

    # 4. Create OrderItems
    for oi in order_items_to_create:
        item_obj = OrderItem(
            order_id=new_order.id,
            store_id=store.id,
            product_id=oi["product_id"],
            variant_id=oi["variant_id"],
            name_snapshot=oi["name_snapshot"],
            price_snapshot=oi["price_snapshot"],
            qty=oi["qty"],
        )
        db.add(item_obj)

    # 5. Create initial OrderEvent
    event = OrderEvent(
        order_id=new_order.id,
        store_id=store.id,
        status="placed",
        note=f"Order placed successfully by {data.customer_name}.",
    )
    db.add(event)

    # 6. Create simulated Customer Notification
    notification = Notification(
        store_id=store.id,
        order_id=new_order.id,
        channel="email",
        message=f"Order {order_number} confirmed! Total: ₹{total:.2f}. We will pack your items shortly.",
    )
    db.add(notification)

    # Commit atomic order placement
    db.commit()

    # Refresh with relationships loaded
    full_order = db.scalar(
        select(Order)
        .options(joinedload(Order.items), joinedload(Order.events))
        .where(Order.id == new_order.id)
    )
    return OrderResponse.model_validate(full_order)


@router.get("/{slug}/orders/{order_number}", response_model=OrderResponse)
def track_public_order(
    slug: str,
    order_number: str,
    email: EmailType = Query(..., description="Customer email for verification"),
    db: Session = Depends(get_db),
) -> OrderResponse:
    """Track an existing order. Requires matching email to protect customer privacy."""
    clean_slug = slug.strip().lower()
    store = db.scalar(select(Store).where(Store.slug == clean_slug))
    if not store:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    order = db.scalar(
        select(Order)
        .options(joinedload(Order.items), joinedload(Order.events))
        .where(
            Order.store_id == store.id,
            Order.order_number == order_number.strip().upper(),
            func.lower(Order.email) == email.strip().lower(),
        )
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found or email verification failed.",
        )
    return OrderResponse.model_validate(order)
