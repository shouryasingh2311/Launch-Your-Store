# PROJECT.md — Launch-Your-Store (Backend)

## Identity
- **Name:** Launch-Your-Store
- **Type:** Multi-tenant SaaS backend for a no-code storefront builder
- **Context:** Cypher hackathon (MyStartupWave) · 2-person team · ~7 hours · you own the backend
- **One-line pitch:** A small business owner fills a wizard, picks a theme, and gets a live online store + admin panel + AI assistant — all backed by this API.

## Problem
Small sellers can't afford a developer. This platform gives them a working store in minutes.

## Scope (Backend Only)
You build: FastAPI app, DB schema, auth, tenancy, all REST endpoints, CSV import logic, Gemini chatbot integration, Docker, deployment.
Frontend teammate builds: React SPA, wizard UI, storefront, admin panel, theme system.
Contract-first: agree on API shape early so neither side blocks the other.

## Tech Stack
| Layer | Choice | Notes |
|---|---|---|
| Framework | FastAPI (Pydantic v2) | Auto-generated `/docs` is the API contract |
| ORM | SQLAlchemy 2.0 | `create_all` for hackathon; skip Alembic |
| Auth | PyJWT + bcrypt | Email/password. JWT carries `user_id`, `store_id`, `role` |
| CSV/Excel | Python `csv` + `openpyxl` | Avoid pandas — heavy for serverless cold starts |
| Database | Supabase hosted Postgres | Transaction pooler, `NullPool`, disable prepared statements |
| File storage | Supabase Storage | Logos, banners, product images |
| AI | Gemini free tier (`google-genai` SDK) | Function calling for chatbot, structured output for setup |
| Hosting | Vercel (serverless function) or Render/Railway fallback | Hour-0 spike decides |
| CI/CD | Vercel Git integration | Auto-deploy on push to `main` |

## Architecture
```
Browser (React SPA on Vercel)
  │  REST + JWT (admin) / no token (public)
  ▼
FastAPI backend (Vercel serverless or Render)
  ├── Supabase Postgres (data)
  ├── Supabase Storage (images)
  └── Gemini API (chatbot + AI setup)
```

**Tenant resolution:**
- Public routes: store from URL slug (`/api/public/{slug}/...`)
- Admin routes: store from JWT
- `store_id` is NEVER read from request body or LLM output

## Environment Variables
Backend: `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `FRONTEND_ORIGIN`
Frontend: `VITE_API_URL`

## Key Decisions
1. Path routing (`/s/slug`), not subdomains — saves hours of DNS config
2. LLM never writes SQL or produces numbers — it only picks a tool; backend computes
3. No real payments, email/SMS, custom domains, or multi-image galleries
4. No OAuth, password reset, or email verification
5. Return 404 (not 403) when an ID belongs to another store — don't leak existence
6. No new features after hour 5:30 — only integrate, fix, polish

## Data Model
Every tenant-owned table has a `store_id` column with an index.

| Table | Key Columns |
|---|---|
| `stores` | id, slug (unique), name, logo_url, contact_email, phone, address, business_type, theme_id, theme_overrides (JSON), content (JSON), created_at |
| `users` | id, email (unique), password_hash, role (`owner`/`staff`), store_id |
| `categories` | id, store_id, name, slug, image_url, sort_order |
| `products` | id, store_id, category_id, name, description, price, compare_at_price, discount_pct, stock, low_stock_threshold, image_url, sku, is_active |
| `product_variants` | id, product_id, store_id, name, sku, price_delta, stock |
| `orders` | id, store_id, order_number (per store), customer_name, email, phone, address, subtotal, discount, shipping, total, status, payment_method, created_at |
| `order_items` | id, order_id, store_id, product_id, variant_id, name_snapshot, price_snapshot, qty |
| `order_events` | id, order_id, store_id, status, note, created_at |
| `notifications` | id, store_id, order_id, channel, message, created_at |

Order status enum: `placed → packed → shipped → delivered → cancelled`

## Never Cut
- Tenant isolation
- Empty/loading/error states (API must return proper status codes + messages)
- The live URL working
- Chatbot's honesty rule
- README

## Team
- **You:** Backend (FastAPI, DB, auth, tenancy, CSV, orders, dashboard, Gemini, Docker, deploy)
- **Teammate:** Frontend (React, Vite, Tailwind, shadcn, wizard, storefront, themes, admin UI, chatbot panel)

## Timeline Pressure
~7 hours total. Backend milestones from the doc:
- 0:00–0:30 — Scaffold, DB schema, `/health`, Vercel spike, agree API contract
- 0:30–1:30 — Auth, store creation, categories, `get_tenant`, seed + dummy import
- 1:30–3:00 — Public storefront endpoints, order creation + stock check, product CRUD
- 3:00–4:30 — Dashboard aggregates, order status + events, content/theme endpoints, uploads
- 4:30–5:30 — CSV endpoints, chatbot tools + Gemini, AI setup endpoint
- 5:30–6:15 — Isolation tests, bug fixes, rate limits, seed demo store
- 6:15–7:00 — README, architecture diagram, Dockerfile + compose, final deploy + smoke test
