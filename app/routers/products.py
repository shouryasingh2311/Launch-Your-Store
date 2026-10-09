from decimal import Decimal
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.auth import TenantContext, require_owner, require_staff_or_owner
from app.database import get_db
from app.models import Product, ProductVariant
from app.schemas import (
    ProductBulkUpdateRequest,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter(prefix="/products", tags=["Products (Admin)"])


@router.get("", response_model=list[ProductResponse])
def list_products(
    category_id: int | None = None,
    q: str | None = None,
    is_active: bool | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> list[ProductResponse]:
    """List products for the authenticated merchant's store with search and filters."""
    if not tenant.store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    query = (
        select(Product)
        .options(joinedload(Product.category), joinedload(Product.variants))
        .where(Product.store_id == tenant.store_id)
    )

    if category_id is not None:
        query = query.where(Product.category_id == category_id)
    if is_active is not None:
        query = query.where(Product.is_active == is_active)
    if q:
        search_filter = f"%{q.strip().lower()}%"
        query = query.where(
            or_(
                func.lower(Product.name).like(search_filter),
                func.lower(Product.description).like(search_filter),
                func.lower(Product.sku).like(search_filter),
            )
        )

    offset = (page - 1) * limit
    products = db.scalars(query.order_by(Product.id.desc()).offset(offset).limit(limit)).unique().all()
    return [ProductResponse.model_validate(p) for p in products]


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    data: ProductCreate,
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> ProductResponse:
    """Create a new product in the current merchant's store."""
    if not tenant.store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    product = Product(
        store_id=tenant.store_id,
        category_id=data.category_id,
        name=data.name,
        description=data.description,
        price=Decimal(str(data.price)),
        compare_at_price=Decimal(str(data.compare_at_price)) if data.compare_at_price else None,
        discount_pct=data.discount_pct,
        stock=data.stock,
        low_stock_threshold=data.low_stock_threshold,
        image_url=data.image_url,
        sku=data.sku,
        is_active=data.is_active,
    )
    db.add(product)
    db.flush()

    # Add variants if provided
    for v_data in data.variants:
        variant = ProductVariant(
            product_id=product.id,
            store_id=tenant.store_id,
            name=v_data.name,
            sku=v_data.sku,
            price_delta=Decimal(str(v_data.price_delta)),
            stock=v_data.stock,
        )
        db.add(variant)

    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> ProductResponse:
    """Get single product detail. Returns 404 if not found in this store."""
    product = db.scalar(
        select(Product)
        .options(joinedload(Product.category), joinedload(Product.variants))
        .where(Product.id == product_id, Product.store_id == tenant.store_id)
    )
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    return ProductResponse.model_validate(product)


@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    data: ProductUpdate,
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> ProductResponse:
    """Update fields on an existing product strictly within merchant's store."""
    product = db.scalar(
        select(Product)
        .options(joinedload(Product.category), joinedload(Product.variants))
        .where(Product.id == product_id, Product.store_id == tenant.store_id)
    )
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

    update_dict = data.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("price", "compare_at_price") and val is not None:
            setattr(product, field, Decimal(str(val)))
        else:
            setattr(product, field, val)

    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(
    product_id: int,
    tenant: TenantContext = Depends(require_owner),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """Delete a product. Restricted to store owner."""
    product = db.scalar(
        select(Product).where(Product.id == product_id, Product.store_id == tenant.store_id)
    )
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

    db.delete(product)
    db.commit()
    return {"status": "deleted", "id": product_id}


@router.post("/bulk", status_code=status.HTTP_200_OK)
def bulk_update_products(
    data: ProductBulkUpdateRequest,
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """Bulk update stock, price, or active status for selected products."""
    if not data.product_ids:
        return {"updated_count": 0}

    products = db.scalars(
        select(Product).where(
            Product.id.in_(data.product_ids),
            Product.store_id == tenant.store_id,
        )
    ).all()

    count = 0
    for product in products:
        if data.stock is not None:
            product.stock = data.stock
        if data.price is not None:
            product.price = Decimal(str(data.price))
        if data.is_active is not None:
            product.is_active = data.is_active
        count += 1

    db.commit()
    return {"status": "success", "updated_count": count}
