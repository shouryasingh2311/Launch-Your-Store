# REQUIREMENTS.md — Launch-Your-Store Backend

## Full-Stack Planning Checklist

| Item | Status | Notes |
|---|---|---|
| System design & architecture | ✅ needed now | FastAPI + Supabase Postgres + Vercel/Render |
| Frontend | ⬜ not applicable | Teammate's scope |
| APIs & backend logic | ✅ needed now | All REST endpoints per API contract |
| Databases & storage | ✅ needed now | Supabase Postgres + Supabase Storage |
| Auth & permissions | ✅ needed now | JWT + bcrypt, owner/staff roles, tenant isolation |
| Hosting & cloud | ✅ needed now | Vercel serverless (with Render fallback) |
| CI/CD & version control | ✅ needed now | Vercel Git integration, GitHub repo `teamname_Cypher` |
| Security | ✅ needed now | Tenant isolation, CORS, no secret leaks, 404 not 403 |
| Rate limiting | ✅ needed now | Chatbot endpoint, auth endpoints |
| Caching & CDN | 🔲 deferred | `ponytail:` TanStack Query handles client caching; server-side cache only for chatbot (60s) |
| Error tracking & logs | ✅ needed now | Structured request logging, global error handler, `/health` |
| Monitoring & alerts | 🔲 deferred | `ponytail:` Sentry if Student Pack offers it; not critical for hackathon |
| Testing | ✅ needed now | 3 tenant isolation tests minimum |
| Scaling | 🔲 not applicable | Hackathon scale |

---

## R1: Scaffold & Deploy Spike
**Priority:** P0 (first 30 minutes)
- [ ] FastAPI project with Pydantic v2
- [ ] SQLAlchemy 2.0 models with `create_all`
- [ ] `/health` endpoint returning `{"status": "ok"}`
- [ ] Supabase Postgres connection with `NullPool` + no prepared statements
- [ ] Deploy to Vercel; confirm cold start < 10s. If not, pivot to Render
- [ ] CORS configured: allow only `FRONTEND_ORIGIN`
- [ ] `.env.example` in repo, `.env` in `.gitignore`
- [ ] Agree API contract shape with frontend teammate (the FastAPI `/docs` page IS the contract)

**UAT:** `/health` returns 200 on the deployed URL.

## R2: Auth & Store Creation
**Priority:** P0
- [ ] `POST /auth/signup` — email + password, hash with bcrypt, create user + store, return JWT
- [ ] `POST /auth/login` — validate credentials, return JWT with `user_id`, `store_id`, `role`
- [ ] `GET /auth/me` — return current user profile from JWT
- [ ] JWT carries `user_id`, `store_id`, `role`; 24h expiry
- [ ] `get_tenant` dependency — extracts and validates JWT, returns `(store_id, user_id, role)`
- [ ] `require_owner` dependency — 404 if role != owner
- [ ] `require_staff_or_owner` dependency — 404 if role not in (owner, staff)
- [ ] `POST /stores` — wizard creates store with slug, name, business_type
- [ ] `GET /slug-available?slug=` — check slug uniqueness

**UAT:** Sign up, log in, JWT decodes correctly, tenant deps work.

## R3: Categories & Seed Data
**Priority:** P0
- [ ] `GET /categories/predefined` — return the 6-8 preset category list
- [ ] `POST /stores/me/categories` — owner picks/creates categories
- [ ] `POST /stores/me/import-dummy` — copy seed JSON products for chosen categories into store
- [ ] Seed JSON: 6-8 categories × 8-10 products each, realistic names, INR prices, one-line descriptions
- [ ] Seed a demo store with ~30 days of fake orders for dashboard/chatbot data

**UAT:** Dummy import creates real products viewable via API.

## R4: Product CRUD
**Priority:** P0
- [ ] `GET /products` — list with pagination, search, category filter
- [ ] `POST /products` — create product with validation
- [ ] `PATCH /products/{id}` — update (stock, price, details)
- [ ] `DELETE /products/{id}` — soft or hard delete
- [ ] `POST /products/bulk` — bulk stock/price update for selected IDs
- [ ] `POST /uploads` — image upload to Supabase Storage, return URL
- [ ] All queries filtered by `store_id` from `get_tenant`

**UAT:** CRUD works, images upload, another store's products return 404.

## R5: Public Storefront Endpoints
**Priority:** P0
- [ ] `GET /public/{slug}` — store info (name, logo, theme, content, categories)
- [ ] `GET /public/{slug}/products` — with `?category&q&min&max&sort` filters + pagination
- [ ] `GET /public/{slug}/products/{id}` — single product with variants
- [ ] `POST /public/{slug}/orders` — create order, validate stock, decrement stock, snapshot prices
- [ ] `GET /public/{slug}/orders/{number}?email=` — order tracking (verify email matches)
- [ ] No auth required on public routes; store resolved from slug

**UAT:** Shopper flow works end-to-end without auth. Stock decrements on order.

## R6: Order Management
**Priority:** P0
- [ ] `GET /orders` — list orders for store, filterable by status
- [ ] `GET /orders/{id}` — order detail with items and event timeline
- [ ] `PATCH /orders/{id}/status` — update status, create `order_event`, create simulated `notification`
- [ ] Status flow: placed → packed → shipped → delivered (or cancelled from any pre-shipped state)
- [ ] Order number is per-store sequential

**UAT:** Status change logs event, notification created, timeline shows correctly.

## R7: Dashboard
**Priority:** P1
- [ ] `GET /dashboard/summary` — KPIs: total revenue, order count, avg order value, low-stock count
- [ ] `GET /dashboard/revenue-series` — daily revenue for chart (last 30 days default)
- [ ] `GET /dashboard/activity` — recent events feed (orders, status changes)

**UAT:** Dashboard returns real aggregated data for the demo store.

## R8: Settings & Content
**Priority:** P1
- [ ] `GET /stores/me` — full store config
- [ ] `PATCH /stores/me` — update name, contact, address, etc.
- [ ] `PATCH /stores/me/theme` — update `theme_id` + `theme_overrides`
- [ ] `PATCH /stores/me/content` — update banners, homepage sections, footer
- [ ] `GET /team` — list team members (owner + staff)
- [ ] `POST /team` — invite staff (create user with `role=staff`, same `store_id`)

**UAT:** Theme and content changes persist and reflect on public endpoint.

## R9: CSV/Excel Import
**Priority:** P1
- [ ] `GET /import/template` — download CSV template with correct headers
- [ ] `POST /import/preview` — parse first 10 rows, return headers + data preview
- [ ] `POST /import/validate` — validate all rows: missing fields, bad prices (handle `₹1,299`, `Rs. 499`), non-integer stock, unknown categories (offer auto-create), duplicates, blank rows
- [ ] `POST /import/commit` — import valid rows, return `{imported: N, skipped: M, errors: [...]}` with downloadable error CSV
- [ ] Column mapping: fuzzy header match (`Product Name` → `name`, `MRP` → `price`)

**UAT:** Messy CSV with all error types produces a correct error report; valid rows import.

## R10: AI Chatbot
**Priority:** P1
- [ ] `POST /chat` — send question to Gemini with function-calling tools, return `{answer, table, tool, params}`
- [ ] Tools (all filtered by server-injected `store_id`):
  - `top_products(period, limit, by)`
  - `low_stock(threshold)`
  - `revenue_compare(period_a, period_b)`
  - `orders_summary(period, status)`
  - `sales_by_category(period)`
  - `product_info(name)`
- [ ] Period enum: `today, this_week, last_week, this_month, last_month, last_7_days, last_30_days`
- [ ] If Gemini returns no tool call or tool returns nothing → fixed reply: "I don't have that data."
- [ ] Prompt-injection safety: treat product names/descriptions as data, not instructions
- [ ] `POST /chat/tool` — chips endpoint, calls tools directly without LLM (fallback when rate-limited)
- [ ] Cache identical questions for 60s
- [ ] Rate-limit the `/chat` endpoint

**UAT:** Normal question works, unsupported question gets honest refusal, cross-store attack blocked.

## R11: AI Store Setup
**Priority:** P1
- [ ] `POST /ai/setup-suggestions` — takes one-sentence description, returns `{categories: [{name, emoji}], tagline, theme_id}` via Gemini structured output
- [ ] Validate with Pydantic; constrain `theme_id` to the four themes
- [ ] Fall back to defaults if Gemini call fails or times out

**UAT:** Description → suggestions returned; timeout → defaults returned.

## R12: Tenant Isolation Tests
**Priority:** P0 (never cut)
- [ ] Test: owner A requests owner B's product → 404
- [ ] Test: owner A requests owner B's order → 404
- [ ] Test: owner A requests owner B's dashboard → empty/404
- [ ] All tenant-scoped queries go through repository functions that require `store_id` param

**UAT:** All 3 tests pass. Show one in the demo.

## R13: Hardening & Polish
**Priority:** P1
- [ ] Global error handler — no stack traces to client, log server-side
- [ ] Structured request logging
- [ ] CORS: only `FRONTEND_ORIGIN`
- [ ] Rate limits on auth routes (strict) and chatbot (moderate)
- [ ] Input validation on all endpoints via Pydantic schemas
- [ ] No secrets in code or frontend bundle

## R14: Deployment & Docker
**Priority:** P1
- [ ] Dockerfile for backend
- [ ] `docker-compose.yml` running backend locally
- [ ] `vercel.json` or deployment config
- [ ] Seed demo store script (creates store + products + 30 days of orders)
- [ ] README: overview, setup instructions, env vars, architecture diagram (Mermaid), test logins, known limitations

**UAT:** `docker-compose up` works. Deployed URL responds. README is complete.

## Security Hardening

| Measure | Status |
|---|---|
| Rate limiting (auth strict, chatbot moderate) | ✅ needed |
| Input validation (Pydantic on every endpoint) | ✅ needed |
| Secrets in env vars only | ✅ needed |
| No stack traces to client | ✅ needed |
| Tenant isolation (single dependency, 404 not 403) | ✅ needed |
| CORS (frontend origin only) | ✅ needed |
| File upload validation | 🔲 deferred — `ponytail:` Supabase Storage handles type/size; add content validation if time permits |
