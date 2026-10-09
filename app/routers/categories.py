import re
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import TenantContext, require_owner, require_staff_or_owner
from app.database import get_db
from app.models import Category, Product
from app.schemas import (
    CategoryBatchCreate,
    CategoryCreate,
    CategoryResponse,
    ImportDummyRequest,
    ImportDummyResponse,
    PredefinedCategory,
)
from app.seed_data import PREDEFINED_CATEGORIES, SEED_PRODUCTS_BY_CATEGORY

router = APIRouter(tags=["Categories & Catalog"])


def slugify(text: str) -> str:
    """Generate a clean URL-friendly slug from text."""
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    return s.strip("-")


@router.get("/categories/predefined", response_model=list[PredefinedCategory])
def get_predefined_categories() -> list[PredefinedCategory]:
    """Return the 8 curated preset category options for the onboarding wizard."""
    return [PredefinedCategory(**cat) for cat in PREDEFINED_CATEGORIES]


@router.get("/stores/me/categories", response_model=list[CategoryResponse])
def get_store_categories(
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> list[CategoryResponse]:
    """Retrieve all categories configured for the current store."""
    if not tenant.store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found.",
        )

    categories = db.scalars(
        select(Category)
        .where(Category.store_id == tenant.store_id)
        .order_by(Category.sort_order, Category.id)
    ).all()
    return [CategoryResponse.model_validate(c) for c in categories]


@router.post("/stores/me/categories", response_model=list[CategoryResponse], status_code=status.HTTP_201_CREATED)
def create_store_categories(
    data: CategoryBatchCreate,
    tenant: TenantContext = Depends(require_owner),
    db: Session = Depends(get_db),
) -> list[CategoryResponse]:
    """Save chosen/custom categories for the store during onboarding wizard step 2."""
    if not tenant.store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found. Please create your store first.",
        )

    created_or_existing: list[Category] = []

    for cat_data in data.categories:
        cat_slug = cat_data.slug or slugify(cat_data.name)
        # Check if category already exists in this store
        existing = db.scalar(
            select(Category).where(
                Category.store_id == tenant.store_id,
                Category.slug == cat_slug,
            )
        )
        if existing:
            created_or_existing.append(existing)
            continue

        new_cat = Category(
            store_id=tenant.store_id,
            name=cat_data.name,
            slug=cat_slug,
            image_url=cat_data.image_url,
            sort_order=cat_data.sort_order,
        )
        db.add(new_cat)
        created_or_existing.append(new_cat)

    db.commit()
    for cat in created_or_existing:
        db.refresh(cat)

    return [CategoryResponse.model_validate(c) for c in created_or_existing]


@router.post("/stores/me/import-dummy", response_model=ImportDummyResponse)
def import_dummy_products(
    data: ImportDummyRequest,
    tenant: TenantContext = Depends(require_owner),
    db: Session = Depends(get_db),
) -> ImportDummyResponse:
    """One-click seed import: populate the store with realistic catalog products."""
    if not tenant.store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found. Please create your store first.",
        )

    # 1. Fetch existing categories for this store
    categories_query = select(Category).where(Category.store_id == tenant.store_id)
    if data.category_ids:
        categories_query = categories_query.where(Category.id.in_(data.category_ids))

    store_categories = db.scalars(categories_query).all()

    # If store has no categories yet, auto-create the predefined 8 categories
    if not store_categories:
        for idx, pre_cat in enumerate(PREDEFINED_CATEGORIES):
            cat = Category(
                store_id=tenant.store_id,
                name=pre_cat["name"],
                slug=pre_cat["slug"],
                sort_order=idx,
            )
            db.add(cat)
        db.commit()
        store_categories = db.scalars(
            select(Category).where(Category.store_id == tenant.store_id)
        ).all()

    # Map category names to their DB category objects
    cat_lookup = {c.name.lower(): c for c in store_categories}
    total_imported = 0
    categories_used = set()

    # 2. Insert dummy seed products for matching categories
    for cat_name, product_list in SEED_PRODUCTS_BY_CATEGORY.items():
        matched_cat = cat_lookup.get(cat_name.lower())
        if not matched_cat:
            continue

        categories_used.add(cat_name)

        for p_data in product_list:
            # Check if product with same SKU or name already exists in this store
            existing_product = db.scalar(
                select(Product).where(
                    Product.store_id == tenant.store_id,
                    Product.sku == p_data["sku"],
                )
            )
            if existing_product:
                continue

            product = Product(
                store_id=tenant.store_id,
                category_id=matched_cat.id,
                name=p_data["name"],
                description=p_data["description"],
                price=Decimal(str(p_data["price"])),
                compare_at_price=Decimal(str(p_data["compare_at_price"])) if p_data.get("compare_at_price") else None,
                discount_pct=p_data.get("discount_pct", 0),
                stock=p_data.get("stock", 20),
                low_stock_threshold=5,
                image_url=p_data.get("image_url"),
                sku=p_data.get("sku"),
                is_active=True,
            )
            db.add(product)
            total_imported += 1

    db.commit()

    return ImportDummyResponse(
        status="success",
        imported_products=total_imported,
        imported_categories=list(categories_used),
        message=f"Successfully imported {total_imported} dummy products across {len(categories_used)} categories.",
    )
