from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import TenantContext, hash_password, require_owner, require_staff_or_owner
from app.database import get_db
from app.models import User
from app.schemas import TeamMemberCreate, TeamMemberResponse

router = APIRouter(prefix="/team", tags=["Team (Admin)"])


@router.get("", response_model=list[TeamMemberResponse])
def list_team_members(
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> list[TeamMemberResponse]:
    """List all team members (owner and staff) assigned to this store."""
    if not tenant.store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    members = db.scalars(
        select(User).where(User.store_id == tenant.store_id).order_by(User.id)
    ).all()
    return [TeamMemberResponse.model_validate(m) for m in members]


@router.post("", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
def invite_staff_member(
    data: TeamMemberCreate,
    tenant: TenantContext = Depends(require_owner),
    db: Session = Depends(get_db),
) -> TeamMemberResponse:
    """Create a new staff member account for this store. Restricted strictly to store owner."""
    if not tenant.store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    # Check if email is already registered
    existing_user = db.scalar(select(User).where(User.email == data.email))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists.",
        )

    hashed = hash_password(data.password)
    new_staff = User(
        email=data.email,
        password_hash=hashed,
        role="staff",
        store_id=tenant.store_id,
    )
    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)

    return TeamMemberResponse.model_validate(new_staff)
