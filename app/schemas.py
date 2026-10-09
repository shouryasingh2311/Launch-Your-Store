from datetime import datetime
from typing import Annotated, Any
from pydantic import BaseModel, ConfigDict, Field

EmailType = Annotated[
    str,
    Field(
        pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
        description="Valid email address",
    ),
]


# ===================== AUTH SCHEMAS =====================

class UserSignupRequest(BaseModel):
    email: EmailType
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters.")


class UserLoginRequest(BaseModel):
    email: EmailType
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    role: str
    store_id: int | None
    created_at: datetime


# ===================== STORE SCHEMAS =====================

class StoreCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    slug: str = Field(..., min_length=2, max_length=100, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    business_type: str | None = Field(None, max_length=100)
    contact_email: EmailType | None = None
    phone: str | None = Field(None, max_length=50)
    address: str | None = None


class StoreResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str
    logo_url: str | None
    contact_email: str | None
    phone: str | None
    address: str | None
    business_type: str | None
    theme_id: str
    theme_overrides: dict[str, Any]
    content: dict[str, Any]
    created_at: datetime


class SlugCheckResponse(BaseModel):
    slug: str
    is_available: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    store: StoreResponse | None = None


# ===================== CATEGORY SCHEMAS =====================

class PredefinedCategory(BaseModel):
    name: str
    emoji: str
    slug: str
    description: str


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    slug: str | None = Field(None, max_length=150)
    image_url: str | None = None
    sort_order: int = 0


class CategoryBatchCreate(BaseModel):
    categories: list[CategoryCreate]


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    store_id: int
    name: str
    slug: str
    image_url: str | None
    sort_order: int


# ===================== SEED / DUMMY SCHEMAS =====================

class ImportDummyRequest(BaseModel):
    category_ids: list[int] | None = Field(
        None,
        description="Optional list of specific category IDs to import products for. If not provided, imports for all store categories.",
    )


class ImportDummyResponse(BaseModel):
    status: str
    imported_products: int
    imported_categories: list[str]
    message: str
