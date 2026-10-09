# ROADMAP.md — Launch-Your-Store Backend

## Milestone 1: Hackathon MVP (7 hours)

All phases below are backend-only. Frontend teammate works in parallel against mock data, then swaps in real endpoints as they land.

---

### Phase 1: Scaffold + Deploy Spike (0:00–0:30)
**Goal:** FastAPI running on Supabase Postgres, deployed, `/health` live.
**Requirements:** R1
**Delivers:**
- FastAPI project structure
- SQLAlchemy models + `create_all` for all tables
- Supabase Postgres connection (NullPool, no prepared statements)
- `/health` endpoint
- CORS middleware
- `.env.example`, `.gitignore`
- Deployed to Vercel (or Render if cold start > 10s)
- API contract agreed with frontend teammate (share `/docs` URL)

**Exit criteria:** `/health` returns 200 on the live URL.

---

### Phase 2: Auth + Store Creation + Categories + Seed (0:30–1:30)
**Goal:** A user can sign up, create a store, pick categories, and import dummy products.
**Requirements:** R2, R3
**Delivers:**
- Signup / login / me endpoints with JWT
- `get_tenant`, `require_owner`, `require_staff_or_owner` dependencies
- Store creation with slug uniqueness check
- Predefined categories endpoint
- Category selection endpoint
- Dummy product import from seed JSON
- Seed demo store with 30 days of fake orders

**Exit criteria:** Full signup → wizard flow works via API. Demo store has products and order history.

---

### Phase 3: Public Storefront + Orders + Product CRUD (1:30–3:00)
**Goal:** A shopper can browse the store and place an order. Owner can manage products.
**Requirements:** R4, R5, R6
**Delivers:**
- Product CRUD (list, create, update, delete, bulk update)
- Image upload to Supabase Storage
- Public store info endpoint
- Public product listing with filters (category, search, price range, sort)
- Public single product endpoint
- Order creation with stock validation + decrement + price snapshot
- Order tracking endpoint (verify email)
- Order management: list, detail, status update, event timeline, notifications

**Exit criteria:** Shopper can browse → add to cart → checkout → track order. Owner can CRUD products and manage orders. Stock decrements correctly.

---

### Phase 4: Dashboard + Settings + Content (3:00–4:30)
**Goal:** Admin dashboard shows real data. Store settings and content are editable.
**Requirements:** R7, R8
**Delivers:**
- Dashboard KPIs (revenue, orders, AOV, low-stock count)
- Revenue time series for charts
- Activity feed
- Store settings CRUD (name, contact, etc.)
- Theme update endpoint
- Content update endpoint (banners, sections, footer)
- Team management (list + invite staff)

**Exit criteria:** Dashboard shows real aggregated data for demo store. Settings changes persist and reflect on public endpoint.

---

### Phase 5: CSV Import + Chatbot + AI Setup (4:30–5:30)
**Goal:** CSV import with error reporting. AI chatbot with tool calling. AI-powered store setup suggestions.
**Requirements:** R9, R10, R11
**Delivers:**
- CSV template download
- CSV preview, validate, commit pipeline with error report
- Fuzzy column mapping
- Chatbot with 6 Gemini function-calling tools
- Chips-only fallback (no LLM)
- 60s response cache on chatbot
- AI setup suggestions endpoint
- Rate limiting on chatbot

**Exit criteria:** Messy CSV produces correct error report. Chatbot answers with data table. Honest refusal on unsupported questions. AI suggestions return valid structured data.

---

### Phase 6: Hardening + Isolation Tests + Seed Demo (5:30–6:15)
**Goal:** No new features. Lock it down, test isolation, seed the demo.
**Requirements:** R12, R13
**Delivers:**
- 3 tenant isolation tests (pass/fail)
- Global error handler (no stack traces to client)
- Structured request logging
- Rate limits on auth + chatbot endpoints
- Input validation audit (Pydantic on everything)
- Seed demo store script with realistic data
- Bug fixes from integration with frontend

**Exit criteria:** All 3 isolation tests pass. No raw errors leak. Auth + chatbot rate-limited.

---

### Phase 7: Docker + README + Final Deploy (6:15–7:00)
**Goal:** Ship it. Everything documented, containerized, smoke-tested.
**Requirements:** R14
**Delivers:**
- Dockerfile for backend
- `docker-compose.yml` for local dev
- README with: overview, setup, env vars, architecture diagram (Mermaid), test logins, known limitations
- Final deploy + smoke test on phone and desktop
- Demo logins: one owner, one staff, demo store URL

**Exit criteria:** `docker-compose up` works. Deployed URL passes smoke test checklist. README is complete.

---

## Decision Log
| # | Decision | Rationale |
|---|---|---|
| D1 | Path routing (`/s/slug`) not subdomains | Saves hours of wildcard DNS. Subdomains are a config-only upgrade later. |
| D2 | `create_all` not Alembic | Hackathon speed. Schema is stable for the event. |
| D3 | `NullPool` + no prepared statements | Required for Supabase transaction pooler on serverless. |
| D4 | Python `csv` + `openpyxl`, not pandas | Lighter cold starts on serverless. |
| D5 | LLM picks tool, backend computes | Safety, accuracy, tenant isolation. |
| D6 | 404 not 403 for cross-tenant access | Don't leak resource existence. |
| D7 | No OAuth/password reset/email verification | Out of scope per doc. |
| D8 | Seed JSON prepared before hackathon | Realistic data ready for demo. Pre-hackathon prep is allowed. |
