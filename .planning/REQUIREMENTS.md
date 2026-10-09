# Launch-Your-Store Frontend — Requirements

**Project:** LYS | **Scope:** Frontend Only | **Version:** v1

---

## Core Platform

### REQ-001: Project Scaffold & Design System
**Priority:** v1 | **Category:** Foundation
- Vite + React 18 + React Router SPA scaffold
- Tailwind CSS + shadcn/ui (Radix) integration
- Design tokens: brand indigo #4F46E5, slate neutrals, semantic colors
- Typography: Inter, scale 12–36px, body 16px on mobile
- Spacing: 4px base system (4, 8, 12, 16, 24, 32, 48)
- Radius: 8px and 12px; Shadows: two levels
- Reusable component library: Button (primary/secondary/ghost/danger), Input+label+error, Select, Card, Badge, Table, Modal, Drawer, Toast, Skeleton, EmptyState, ErrorState
**Acceptance:** All components render correctly, tokens applied globally, no ad-hoc styling

### REQ-002: Route Structure & Navigation
**Priority:** v1 | **Category:** Foundation
- Public routes: `/`, `/login`, `/signup`, `/s/:slug/*` (storefront)
- Admin routes: `/admin/dashboard`, `/admin/products`, `/admin/orders`, `/admin/settings`, `/admin/team`
- Wizard route: `/onboarding`
- Protected route guards (redirect to login if no JWT)
- 404 page (branded)
**Acceptance:** All routes resolve, guards work, 404 catches unknown paths

### REQ-003: Auth Pages (Login & Signup)
**Priority:** v1 | **Category:** Auth
- Login form: email + password, Zod validation, error states
- Signup form: name + email + password + confirm, Zod validation
- JWT storage (localStorage or httpOnly cookie via backend)
- Auth context/provider with `useAuth()` hook
- Redirect to wizard on first signup, dashboard on subsequent logins
**Acceptance:** Forms validate, API integration works, auth state persists across refresh

---

## Onboarding Wizard

### REQ-004: Wizard Shell & Progress
**Priority:** v1 | **Category:** Wizard | **Checkpoint:** #1
- 5-step wizard with visible progress bar
- Steps: Business Info → Categories → Products → Theme → Review & Launch
- One focus per step, sticky Back/Next on mobile
- Progress persisted if user refreshes (save draft to localStorage)
- Inline validation on blur
**Acceptance:** Progress bar updates, navigation works, state persists on refresh

### REQ-005: Step 1 — Business Info
**Priority:** v1 | **Category:** Wizard | **Checkpoint:** #1
- Fields: store name, slug (auto-generated, editable), business type, contact email, phone, address
- Logo upload with preview
- AI "describe your business" text box at top → calls POST /ai/setup-suggestions
- Pre-fills categories, tagline, theme from AI response (owner can edit)
- Slug availability check (GET /slug-available?slug=)
**Acceptance:** All fields validate, AI suggestions pre-fill downstream steps, logo previews

### REQ-006: Step 2 — Category Selection
**Priority:** v1 | **Category:** Wizard | **Checkpoint:** #2
- Predefined category chips (Fashion, Electronics, Home Decor, etc.)
- Add-custom-category input
- Multi-select with visual feedback
- Pre-selected if AI suggested categories in Step 1
**Acceptance:** Chips toggle, custom categories add, selections carry to next step

### REQ-007: Step 3 — Products (Import Options)
**Priority:** v1 | **Category:** Wizard | **Checkpoints:** #3, #4
- "Import dummy products" button → calls POST /stores/me/import-dummy
- CSV/Excel upload option → template download, file upload, preview
- Column mapping UI with auto-suggest (fuzzy header match)
- Row-level error report: table of row#, field, problem, suggested fix
- Summary: "N imported, M skipped" + downloadable error CSV
**Acceptance:** Dummy import works, CSV upload shows preview + error report, valid rows import

### REQ-008: Step 4 — Theme Selection
**Priority:** v1 | **Category:** Wizard | **Checkpoint:** #5
- 4 theme cards: Minimal, Vibrant, Elegant, Midnight
- Split-screen live preview: phone-sized storefront preview beside controls
- Preview renders the real storefront home component with chosen tokens
- Selection persists
**Acceptance:** All 4 themes visually distinct, live preview updates on selection

### REQ-009: Step 5 — Review & Launch
**Priority:** v1 | **Category:** Wizard | **Checkpoint:** #6
- Summary of all wizard choices
- Edit links back to each step
- "Launch Store" button → POST /stores
- Celebratory success screen: live URL, Copy button, QR code, "Open store" / "Go to admin"
**Acceptance:** Summary accurate, launch creates store, success screen shows working URL

---

## Public Storefront

### REQ-010: Storefront Layout & Theme Application
**Priority:** v1 | **Category:** Storefront | **Checkpoint:** #7
- CSS custom properties applied from store's theme_id + theme_overrides
- Sticky header: logo, search, cart badge
- Layout variants per theme: header style, hero style, product card style, grid density
- Google Fonts loaded per theme (Inter, Poppins, Playfair Display + Lato, Space Grotesk)
**Acceptance:** Each theme renders with distinct look, tokens apply correctly

### REQ-011: Storefront Home Page
**Priority:** v1 | **Category:** Storefront | **Checkpoint:** #7
- Hero section (themed: centered / split / full-bleed)
- Category chips under hero
- Featured products grid (2col mobile, 3col tablet, 4col desktop)
- Product cards: image (fixed aspect ratio), name, price, struck-through compare price, "Low stock" badge, quick add-to-cart
**Acceptance:** Home page loads with store data, grid responsive, cards complete

### REQ-012: Product Listing & Filters
**Priority:** v1 | **Category:** Storefront | **Checkpoint:** #7
- Category filter (from URL or chips)
- Search bar (query parameter `q`)
- Price range filter (min/max)
- Sort options (price low-high, high-low, newest, popular)
- Pagination
- Filters as bottom sheet on mobile
**Acceptance:** Filters work independently and combined, pagination loads more, mobile bottom sheet

### REQ-013: Product Detail Page
**Priority:** v1 | **Category:** Storefront | **Checkpoint:** #7
- Product image, price, compare-at price, discount badge
- Variant selector (single Size/Option variant)
- Quantity stepper
- Description
- Related products section
- Add to cart
**Acceptance:** Product data renders, variant selection works, add-to-cart updates cart

### REQ-014: Cart & Checkout
**Priority:** v1 | **Category:** Storefront | **Checkpoint:** #7
- Cart as slide-over drawer
- Cart items: image, name, variant, quantity (editable), price, remove
- Cart persisted in Zustand + localStorage (per store slug)
- Single-page checkout: customer info (name, email, phone, address), payment method (simulated)
- Price breakdown: subtotal, discount, shipping, total
- Order confirmation: order number, "Track order" link
**Acceptance:** Cart CRUD works, checkout submits order, confirmation shows order number

### REQ-015: Order Tracking (Public)
**Priority:** v1 | **Category:** Storefront
- Track order page: enter order number + email
- Status timeline display
- Order details
**Acceptance:** Order lookup works, status timeline renders

---

## Admin Panel

### REQ-016: Admin Shell & Dashboard
**Priority:** v1 | **Category:** Admin | **Checkpoint:** #8
- Sidebar navigation (desktop) / drawer + bottom nav (mobile)
- KPI cards: revenue, orders, average order value, low-stock count
- Revenue line chart (Recharts)
- Recent activity feed
- Low-stock list with quick restock action
**Acceptance:** Dashboard loads with data, chart renders, responsive layout works

### REQ-017: Product Management
**Priority:** v1 | **Category:** Admin | **Checkpoint:** #10
- Searchable product table with bulk select
- Inline stock edit
- Drawer form: add/edit product with image upload
- Fields: name, description, price, compare_at_price, discount_pct, stock, low_stock_threshold, category, SKU, is_active, image
- Bulk actions: set stock/price for selected
**Acceptance:** CRUD works, search filters, bulk edit applies, images upload

### REQ-018: Order Management
**Priority:** v1 | **Category:** Admin | **Checkpoint:** #11
- Status filter tabs (placed, packed, shipped, delivered, cancelled)
- Order detail drawer with timeline
- Status dropdown that logs a simulated customer notification
**Acceptance:** Status filter works, detail shows timeline, status change logs notification

### REQ-019: Settings — Branding & Content
**Priority:** v1 | **Category:** Admin | **Checkpoint:** #9
- Tabs: Branding, Homepage Sections, Footer & Contact, Theme, Team
- Branding: logo upload, banners, primary/secondary colors, font selection
- Homepage: section toggles (hero, featured, categories, etc.)
- Footer: links, contact info, social links
- Theme: same 4-theme picker with live preview
**Acceptance:** All settings save and reflect on storefront

### REQ-020: Team Management
**Priority:** v1 | **Category:** Admin
- List team members (owner + staff)
- Invite staff (email + role)
- Owner-only access (staff sees 403/redirect)
**Acceptance:** Team list renders, invite works, staff cannot access

---

## AI Chatbot

### REQ-021: Chatbot Panel UI
**Priority:** v1 | **Category:** Chatbot | **Checkpoints:** #13, #14
- Floating action button (bottom-right)
- Slide-out side panel
- Suggested-question chips: "Top 5 products this month", "Low stock items", "Revenue this week vs last week"
- Chat messages: user message, bot response with answer text + data table + "Data used" expander
- Chips call tools directly without LLM (works even if Gemini rate-limited)
- "I don't have that data" message rendering
**Acceptance:** Panel opens/closes, chips work, data tables render, honesty message shows

---

## Cross-Cutting

### REQ-022: Responsive UI
**Priority:** v1 | **Category:** Quality | **Checkpoint:** #15
- Tested at 360px, 768px, 1280px
- No horizontal scrolling at any width
- Tables → stacked cards on mobile
- Tap targets ≥ 44×44px
- Admin sidebar → drawer + bottom nav
- Storefront grid adapts (2/3/4 columns)
**Acceptance:** No layout breaks at all three breakpoints

### REQ-023: Loading / Empty / Error States
**Priority:** v1 | **Category:** Quality
- Every screen has: skeleton loading, empty state (icon + message + CTA), error state (message + retry)
- Success: toast feedback on every action
- Destructive actions: confirm dialog
**Acceptance:** All three states visible on every screen, toasts fire, confirms block destructive ops

### REQ-024: Accessibility Basics
**Priority:** v1 | **Category:** Quality
- Contrast ≥ 4.5:1 for body text (all themes)
- Every input has visible label; icon-only buttons have aria-label; images have alt text
- Visible focus rings; full keyboard navigation; dialogs trap focus (Radix handles this)
- Respect `prefers-reduced-motion`
**Acceptance:** Keyboard navigation works, screen reader basics pass, focus visible

### REQ-025: Performance
**Priority:** v1 | **Category:** Quality
- Route-level code splitting (React.lazy)
- Lazy-load images with explicit width/height
- TanStack Query caching
- Paginate product lists
- Animations: transform + opacity only, 150–250ms
**Acceptance:** Lighthouse performance > 80, no layout shifts, fast route transitions

---

## Scoping Summary

| Scope | Count | IDs |
|-------|-------|-----|
| **v1 (build now)** | 25 | REQ-001 through REQ-025 |
| **v2 (post-hackathon)** | 0 | — |
| **Out of scope** | N/A | Real payments, email/SMS, custom domains, OAuth, password reset, multi-image galleries |

**Traceability:** Not yet mapped to roadmap phases.
