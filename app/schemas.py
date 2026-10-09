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


# ===================== PRODUCT SCHEMAS =====================

class ProductVariantCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    sku: str | None = Field(None, max_length=100)
    price_delta: float = 0.0
    stock: int = 0


class ProductVariantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    sku: str | None
    price_delta: float
    stock: int


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    price: float = Field(..., gt=0)
    compare_at_price: float | None = None
    discount_pct: int = Field(0, ge=0, le=100)
    stock: int = Field(0, ge=0)
    low_stock_threshold: int = Field(5, ge=0)
    category_id: int | None = None
    image_url: str | None = None
    sku: str | None = None
    is_active: bool = True
    variants: list[ProductVariantCreate] = []


class ProductUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    price: float | None = Field(None, gt=0)
    compare_at_price: float | None = None
    discount_pct: int | None = Field(None, ge=0, le=100)
    stock: int | None = Field(None, ge=0)
    low_stock_threshold: int | None = Field(None, ge=0)
    category_id: int | None = None
    image_url: str | None = None
    sku: str | None = None
    is_active: bool | None = None


class ProductBulkUpdateRequest(BaseModel):
    product_ids: list[int]
    stock: int | None = Field(None, ge=0)
    price: float | None = Field(None, gt=0)
    is_active: bool | None = None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    store_id: int
    category_id: int | None
    name: str
    description: str | None
    price: float
    compare_at_price: float | None
    discount_pct: int
    stock: int
    low_stock_threshold: int
    image_url: str | None
    sku: str | None
    is_active: bool
    created_at: datetime
    category: CategoryResponse | None = None
    variants: list[ProductVariantResponse] = []


# ===================== PUBLIC STOREFRONT SCHEMAS =====================

class PublicStoreResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    slug: str
    logo_url: str | None
    contact_email: str | None
    phone: str | None
    address: str | None
    business_type: str | None
    theme_id: str
    theme_overrides: dict[str, Any]
    content: dict[str, Any]
    categories: list[CategoryResponse] = []


class PublicProductListResponse(BaseModel):
    total: int
    page: int
    limit: int
    products: list[ProductResponse]


# ===================== ORDER SCHEMAS =====================

class OrderItemCreate(BaseModel):
    product_id: int
    variant_id: int | None = None
    qty: int = Field(1, ge=1)


class OrderCreateRequest(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=200)
    email: EmailType
    phone: str | None = Field(None, max_length=50)
    address: str | None = None
    payment_method: str = Field("cod", max_length=50)
    items: list[OrderItemCreate] = Field(..., min_length=1)


class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int | None
    variant_id: int | None
    name_snapshot: str
    price_snapshot: float
    qty: int


class OrderEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    note: str | None
    created_at: datetime


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    store_id: int
    order_number: str
    customer_name: str
    email: str
    phone: str | None
    address: str | None
    subtotal: float
    discount: float
    shipping: float
    total: float
    status: str
    payment_method: str
    created_at: datetime
    items: list[OrderItemResponse] = []
    events: list[OrderEventResponse] = []


class OrderStatusUpdateRequest(BaseModel):
    status: str = Field(..., pattern=r"^(placed|packed|shipped|delivered|cancelled)$")
    note: str | None = None


# ===================== DASHBOARD SCHEMAS =====================

class DashboardSummaryResponse(BaseModel):
    total_revenue: float
    total_orders: int
    average_order_value: float
    low_stock_count: int
    pending_orders_count: int


class RevenueDataPoint(BaseModel):
    date: str  # YYYY-MM-DD
    revenue: float
    orders_count: int


class ActivityItem(BaseModel):
    id: str
    type: str  # "order", "status_change", "inventory", "store"
    title: str
    description: str
    timestamp: datetime


# ===================== SETTINGS & TEAM SCHEMAS =====================

class StoreProfileUpdate(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=200)
    logo_url: str | None = None
    contact_email: EmailType | None = None
    phone: str | None = Field(None, max_length=50)
    address: str | None = None
    business_type: str | None = Field(None, max_length=100)


class StoreThemeUpdate(BaseModel):
    theme_id: str = Field(..., pattern=r"^(minimal|vibrant|elegant|midnight)$")
    theme_overrides: dict[str, Any] = Field(default_factory=dict)


class StoreContentUpdate(BaseModel):
    content: dict[str, Any] = Field(..., description="Banners, homepage sections, footer")


class TeamMemberCreate(BaseModel):
    email: EmailType
    password: str = Field(..., min_length=8, description="Password for staff account")


class TeamMemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    role: str
    store_id: int | None
    created_at: datetime


# ===================== CSV / EXCEL IMPORT SCHEMAS =====================

class ImportRowError(BaseModel):
    row: int
    field: str
    issue: str
    fix_suggestion: str


class ImportPreviewResponse(BaseModel):
    headers: list[str]
    column_mapping: dict[str, str]
    total_rows: int
    preview_rows: list[dict[str, Any]]


class ImportValidateResponse(BaseModel):
    total_rows: int
    valid_rows: int
    invalid_rows: int
    errors: list[ImportRowError]


class ImportCommitRequest(BaseModel):
    column_mapping: dict[str, str] | None = None
    auto_create_categories: bool = True


class ImportCommitResponse(BaseModel):
    status: str
    imported_count: int
    skipped_count: int
    errors: list[ImportRowError]
    message: str


# ===================== AI STORE SETUP SCHEMAS =====================

class AISetupRequest(BaseModel):
    description: str = Field(..., min_length=5, max_length=500, description="One sentence describing the business")


class AISuggestedCategory(BaseModel):
    name: str
    emoji: str


class AISetupResponse(BaseModel):
    categories: list[AISuggestedCategory]
    tagline: str
    theme_id: str


# ===================== CHATBOT SCHEMAS =====================

class ChatTable(BaseModel):
    columns: list[str]
    rows: list[list[Any]]


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)


class ChatResponse(BaseModel):
    answer: str
    table: ChatTable | None = None
    tool: str | None = None
    params: dict[str, Any] | None = None


class ChatToolDirectRequest(BaseModel):
    tool: str
    params: dict[str, Any] = Field(default_factory=dict)



