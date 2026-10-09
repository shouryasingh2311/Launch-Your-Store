from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import (
    TenantContext,
    create_access_token,
    get_tenant,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models import Store, User
from app.schemas import (
    StoreResponse,
    TokenResponse,
    UserLoginRequest,
    UserResponse,
    UserSignupRequest,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(data: UserSignupRequest, db: Session = Depends(get_db)) -> TokenResponse:
    # 1. Check if email already registered
    existing_user = db.scalar(select(User).where(User.email == data.email))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    # 2. Hash password & create owner user
    hashed = hash_password(data.password)
    user = User(
        email=data.email,
        password_hash=hashed,
        role="owner",
        store_id=None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 3. Generate token
    token = create_access_token(user_id=user.id, store_id=None, role=user.role)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
        store=None,
    )


@router.post("/login", response_model=TokenResponse)
def login(data: UserLoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    # 1. Query user
    user = db.scalar(select(User).where(User.email == data.email))
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # 2. Retrieve store if assigned
    store = None
    if user.store_id:
        store = db.scalar(select(Store).where(Store.id == user.store_id))

    # 3. Generate token
    token = create_access_token(user_id=user.id, store_id=user.store_id, role=user.role)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
        store=StoreResponse.model_validate(store) if store else None,
    )


@router.get("/me", response_model=dict)
def get_me(tenant: TenantContext = Depends(get_tenant)) -> dict:
    """Return authenticated user profile and active store context."""
    return {
        "user": UserResponse.model_validate(tenant.user),
        "store": StoreResponse.model_validate(tenant.store) if tenant.store else None,
    }
