# REQUIREMENTS.md — Launch-Your-Store (Fullstack)

## Core Platform Requirements

### Foundation & Setup
- **REQ-BE-001:** FastAPI application scaffold with `/health`, CORS, and Supabase PostgreSQL integration
- **REQ-FE-001:** Vite + React 18 SPA scaffold with Tailwind CSS, design tokens, and Inter / Google Fonts

### Auth & Multi-Tenancy
- **REQ-BE-002:** JWT auth (`POST /auth/signup`, `POST /auth/login`, `GET /auth/me`), `get_tenant` dependency, and role guards (`require_owner`, `require_staff_or_owner`)
- **REQ-FE-002:** Auth login & signup pages with instant role testing toggle (Owner vs Staff)

### Onboarding Wizard
- **REQ-BE-003:** Store creation (`POST /stores`), slug validation, and category management (`GET /categories/predefined`, `POST /stores/me/categories`)
- **REQ-FE-003:** 5-step onboarding wizard (Profile, Categories, Products, Theme, Launch celebration) with localStorage draft persistence

### Catalog, Seed Data & CSV
- **REQ-BE-004:** Seed import (`POST /stores/me/import-dummy`), product CRUD with variants, and CSV validation endpoints
- **REQ-FE-004:** 1-click dummy product import and CSV inspection report with row-level error diagnosis

### Theme System & Storefront
- **REQ-BE-005:** Public storefront endpoints (`GET /public/{slug}`, `GET /public/{slug}/products`, `POST /public/{slug}/orders`)
- **REQ-FE-005:** 4 dynamic CSS variable themes (Minimal, Vibrant, Elegant, Midnight) with live phone preview and responsive 2/3/4 storefront grid

### Cart & Orders
- **REQ-BE-006:** Atomic order placement with stock decrement, price/name snapshotting, and timeline event logging
- **REQ-FE-006:** Zustand multi-store cart drawer, express checkout with simulated payments, and confetti confirmation

### Admin Dashboard & Settings
- **REQ-BE-007:** KPI aggregations (`GET /dashboard/summary`, `GET /dashboard/revenue-series`, `GET /dashboard/activity`) and store update endpoints
- **REQ-FE-007:** Admin dashboard with Recharts area chart, quick restock actions, product table with inline stock editing, orders drawer, and branding/theme settings

### AI Store Assistant
- **REQ-BE-008:** Gemini tool calling queries (`top_products`, `low_stock`, `revenue_compare`, `orders_summary`, `sales_by_category`) with tenant isolation
- **REQ-FE-008:** Slide-out chatbot panel with fast chips, structured table rendering, data provenance display, and "I don't have that data" safety rule
