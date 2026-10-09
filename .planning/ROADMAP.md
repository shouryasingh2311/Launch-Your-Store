# Launch-Your-Store Frontend — Roadmap

**6 phases** | **25 requirements mapped** | All v1 requirements covered ✅

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation & Design System | Scaffold + tokens + reusable components | REQ-001, REQ-002 | 4 |
| 2 | Auth & Onboarding Wizard | Login/signup + 5-step wizard flow | REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009 | 8 |
| 3 | Theme System & Storefront | 4 themes + all public storefront pages | REQ-010, REQ-011, REQ-012, REQ-013, REQ-014, REQ-015 | 7 |
| 4 | Admin Panel | Dashboard + product/order management + settings | REQ-016, REQ-017, REQ-018, REQ-019, REQ-020 | 6 |
| 5 | AI Chatbot & CSV Import | Chatbot panel + CSV upload UX | REQ-021, REQ-007 (CSV detail) | 3 |
| 6 | Polish & Responsive Pass | Responsive, states, a11y, performance | REQ-022, REQ-023, REQ-024, REQ-025 | 5 |

---

### Phase Details

**Phase 1: Foundation & Design System**
**UI hint:** yes
Goal: Create the Vite + React scaffold, install all dependencies, configure Tailwind + shadcn/ui, define design tokens, build the reusable component library, and set up routing with placeholder pages.
Requirements: REQ-001, REQ-002
Time estimate: 0:00–0:30 (30 min)
Success criteria:
1. Vite dev server runs with React 18 + TypeScript (if used) or JavaScript
2. Tailwind configured with custom design tokens (colors, spacing, radii, shadows)
3. shadcn/ui initialized with all core components: Button, Input, Select, Card, Badge, Table, Modal, Drawer, Toast, Skeleton
4. All routes defined and rendering placeholder pages
5. Branded 404 page renders for unknown routes
6. EmptyState and ErrorState components built and documented
7. Google Fonts (Inter) loading correctly

**Phase 2: Auth & Onboarding Wizard**
**UI hint:** yes
Goal: Build the auth pages (login/signup) and the complete 5-step onboarding wizard with all sub-features: AI setup, category selection, product import options, theme selection with live preview, and launch celebration.
Requirements: REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009
Time estimate: 0:30–1:30 (60 min)
Dependencies: Phase 1 (components + routes)
Success criteria:
1. Login and signup forms with Zod validation and error display
2. Auth context with JWT persistence; protected route redirect works
3. 5-step wizard with progress bar, Back/Next navigation, sticky on mobile
4. Step 1: business info form with AI "describe your business" integration
5. Step 2: category chips (predefined + custom) with multi-select
6. Step 3: dummy import button + CSV upload with preview and error report
7. Step 4: 4 theme cards with split-screen live phone preview
8. Step 5: review summary + launch → celebratory success screen with live URL + QR code

**Phase 3: Theme System & Storefront**
**UI hint:** yes
Goal: Implement the CSS custom property theme system with all 4 themes, then build the complete public storefront: home page, product listing with filters, product detail, cart drawer, checkout, and order tracking.
Requirements: REQ-010, REQ-011, REQ-012, REQ-013, REQ-014, REQ-015
Time estimate: 1:30–3:00 (90 min)
Dependencies: Phase 1 (components), Phase 2 (theme selection data)
Success criteria:
1. Theme tokens applied via CSS custom properties on storefront root
2. All 4 themes render with distinct typography, colors, layout variants
3. Google Fonts load per theme (Inter, Poppins, Playfair Display + Lato, Space Grotesk)
4. Storefront home: themed hero, category chips, product grid (2/3/4 col responsive)
5. Product cards: image, name, price, compare price, low-stock badge, quick add-to-cart
6. Product listing: category filter, search, price range, sort, pagination, mobile bottom sheet
7. Product detail: image, price, variant selector, quantity stepper, description, related products

**Phase 4: Admin Panel**
**UI hint:** yes
Goal: Build the admin shell with sidebar navigation, dashboard with KPIs and charts, product CRUD with bulk edit, order management with status flow, settings with branding/content/theme/team tabs.
Requirements: REQ-016, REQ-017, REQ-018, REQ-019, REQ-020
Time estimate: 3:00–4:30 (90 min)
Dependencies: Phase 1 (components), Phase 2 (auth context for role guards)
Success criteria:
1. Admin shell: sidebar (desktop) / drawer + bottom nav (mobile)
2. Dashboard: KPI cards, revenue chart (Recharts), activity feed, low-stock list
3. Products: searchable table, bulk select, inline stock edit, drawer form with image upload
4. Orders: status filter tabs, detail drawer with timeline, status change with notification log
5. Settings: Branding (logo/banners/colors/fonts), Homepage sections (toggles), Footer/contact, Theme picker, Team management
6. Role-based UI: staff cannot see settings/theme/team tabs

**Phase 5: AI Chatbot & CSV Import**
**UI hint:** yes
Goal: Build the floating chatbot panel with suggested-question chips, message rendering with data tables, and refine the CSV import flow with column mapping and error reporting.
Requirements: REQ-021, REQ-007 (CSV refinement)
Time estimate: 4:30–5:30 (60 min)
Dependencies: Phase 1 (components), Phase 4 (admin shell for panel placement)
Success criteria:
1. Floating action button (bottom-right) opens slide-out chatbot panel
2. Suggested-question chips work without LLM (direct tool calls)
3. Bot responses render: answer text + data table + "Data used" expander
4. "I don't have that data" message renders correctly for unsupported questions

**Phase 6: Polish & Responsive Pass**
**UI hint:** no
Goal: Comprehensive responsive testing at 360/768/1280, ensure all loading/empty/error states are implemented, accessibility audit, performance optimization. No new features.
Requirements: REQ-022, REQ-023, REQ-024, REQ-025
Time estimate: 5:30–6:15 (45 min)
Success criteria:
1. No horizontal scrolling at 360px, 768px, or 1280px
2. All tables convert to stacked cards on mobile
3. All tap targets ≥ 44×44px
4. Every screen has skeleton loading, empty state, and error state
5. Toast feedback on every action; confirm dialogs on destructive actions
6. Contrast ≥ 4.5:1 on all themes; focus rings visible; keyboard navigation works
7. Route-level code splitting active; images lazy-loaded; Lighthouse perf > 80

---

**Traceability:** All 25 v1 requirements are mapped to phases. No requirement left unmapped.
