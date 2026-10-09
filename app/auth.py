from datetime import datetime, timedelta, timezone
from typing import Annotated, Any

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Store, User

security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt."""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its bcrypt hash."""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: int, store_id: int | None, role: str) -> str:
    """Create a signed JWT with user identity, tenant store_id, and role (valid for 24 hours)."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "user_id": user_id,
        "store_id": store_id,
        "role": role,
        "exp": expire,
        "iat": now,
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


class TenantContext:
    def __init__(self, user: User, store: Store | None):
        self.user = user
        self.store = store
        self.user_id = user.id
        self.store_id = store.id if store else None
        self.role = user.role


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Security(security)],
    db: Session = Depends(get_db),
) -> User:
    """Dependency that extracts and validates the authenticated user from the Bearer token."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials missing.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(credentials.credentials)
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing user ID.",
        )

    user = db.scalar(select(User).where(User.id == int(user_id)))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists.",
        )
    return user


def get_tenant(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TenantContext:
    """Dependency that enforces tenant isolation. Returns TenantContext with user and active store."""
    store = None
    if user.store_id:
        store = db.scalar(select(Store).where(Store.id == user.store_id))
    return TenantContext(user=user, store=store)


def require_owner(tenant: TenantContext = Depends(get_tenant)) -> TenantContext:
    """Dependency restricting route to store owners. Returns 404 to avoid leaking existence."""
    if tenant.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found.",
        )
    return tenant


def require_staff_or_owner(tenant: TenantContext = Depends(get_tenant)) -> TenantContext:
    """Dependency restricting route to authenticated store staff or owner."""
    if tenant.role not in ("owner", "staff"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found.",
        )
    return tenant
