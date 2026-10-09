import re
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import TenantContext, get_tenant, require_owner
from app.database import get_db
from app.models import Store, User
from app.schemas import (
    SlugCheckResponse,
    StoreContentUpdate,
    StoreCreateRequest,
    StoreProfileUpdate,
    StoreResponse,
    StoreThemeUpdate,
)

router = APIRouter(tags=["Stores"])


@router.get("/slug-available", response_model=SlugCheckResponse)
def check_slug_availability(
    slug: str = Query(..., min_length=2, max_length=100),
    db: Session = Depends(get_db),
) -> SlugCheckResponse:
    """Public endpoint to check if a store slug is available."""
    # Standardize slug: lowercase and trimmed
    clean_slug = slug.strip().lower()
    if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", clean_slug):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slug must contain only lowercase letters, numbers, and single hyphens.",
        )

    existing = db.scalar(select(Store).where(Store.slug == clean_slug))
    return SlugCheckResponse(slug=clean_slug, is_available=existing is None)


@router.post("/stores", response_model=StoreResponse, status_code=status.HTTP_201_CREATED)
def create_store(
    data: StoreCreateRequest,
    tenant: TenantContext = Depends(require_owner),
    db: Session = Depends(get_db),
) -> StoreResponse:
    """Create a new store for the authenticated user during wizard step 1."""
    # Check if slug is already taken
    clean_slug = data.slug.strip().lower()
    existing_store = db.scalar(select(Store).where(Store.slug == clean_slug))
    if existing_store:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Store slug '{clean_slug}' is already taken. Please choose another.",
        )

    # Check if user already has an active store
    if tenant.user.store_id:
        store = db.scalar(select(Store).where(Store.id == tenant.user.store_id))
        if store:
            # Update existing store instead of creating orphaned duplicate
            store.name = data.name
            store.slug = clean_slug
            store.business_type = data.business_type
            store.contact_email = data.contact_email or tenant.user.email
            store.phone = data.phone
            store.address = data.address
            db.commit()
            db.refresh(store)
            return StoreResponse.model_validate(store)

    # Create new store
    new_store = Store(
        name=data.name,
        slug=clean_slug,
        business_type=data.business_type,
        contact_email=data.contact_email or tenant.user.email,
        phone=data.phone,
        address=data.address,
        theme_id="minimal",
        theme_overrides={},
        content={
            "tagline": "Welcome to our store",
            "announcement": "Free shipping on all orders this week!",
            "hero_title": data.name,
            "hero_subtitle": f"Browse our curated collection of {data.business_type or 'products'}.",
        },
    )
    db.add(new_store)
    db.flush()

    # Link user to this store
    user = db.scalar(select(User).where(User.id == tenant.user.id))
    if user:
        user.store_id = new_store.id

    db.commit()
    db.refresh(new_store)
    return StoreResponse.model_validate(new_store)


@router.get("/stores/me", response_model=StoreResponse)
def get_my_store(tenant: TenantContext = Depends(get_tenant)) -> StoreResponse:
    """Retrieve the active store details for the current tenant."""
    if not tenant.store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No store associated with this account. Please complete onboarding wizard.",
        )
    return StoreResponse.model_validate(tenant.store)


@router.patch("/stores/me", response_model=StoreResponse)
def update_store_profile(
    data: StoreProfileUpdate,
    tenant: TenantContext = Depends(require_owner),
    db: Session = Depends(get_db),
) -> StoreResponse:
    """Update store branding, contact details, and general business profile. Restricted to owner."""
    if not tenant.store:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    store = tenant.store
    update_data = data.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(store, key, val)

    db.commit()
    db.refresh(store)
    return StoreResponse.model_validate(store)


@router.patch("/stores/me/theme", response_model=StoreResponse)
def update_store_theme(
    data: StoreThemeUpdate,
    tenant: TenantContext = Depends(require_owner),
    db: Session = Depends(get_db),
) -> StoreResponse:
    """Update active theme template and custom CSS token overrides. Restricted to owner."""
    if not tenant.store:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    store = tenant.store
    store.theme_id = data.theme_id
    store.theme_overrides = data.theme_overrides

    db.commit()
    db.refresh(store)
    return StoreResponse.model_validate(store)


@router.patch("/stores/me/content", response_model=StoreResponse)
def update_store_content(
    data: StoreContentUpdate,
    tenant: TenantContext = Depends(require_owner),
    db: Session = Depends(get_db),
) -> StoreResponse:
    """Update homepage sections, banners, announcements, and footer. Restricted to owner."""
    if not tenant.store:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    store = tenant.store
    store.content = data.content

    db.commit()
    db.refresh(store)
    return StoreResponse.model_validate(store)

