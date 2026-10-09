# Launch-Your-Store — Frontend

## Project Code: LYS

## One-Line Pitch
A no-code platform where a small business owner fills a short wizard, picks a theme, and gets a live online store, an admin panel, and an AI assistant — all from the browser.

## Context
- **Event:** Cypher Hackathon (MyStartupWave) — Problem 1
- **Team:** 2-person (frontend + backend), ~7 hours
- **Our Role:** Frontend developer — owns everything the browser shows: design system, wizard, storefront, themes, admin UI, chatbot panel
- **Backend Dev:** Owns FastAPI, DB, auth, tenancy, CSV processing, orders, dashboard queries, Gemini integration, Docker, deployment
- **Contract-first:** Work against mock data matching the agreed API contract. Swap in real API as each endpoint lands.

## Users
| Role | Description |
|------|-------------|
| **Owner** | Signs up, creates store, manages everything |
| **Staff** | Limited admin (orders + inventory only; no settings/theme/team) |
| **Shopper** | Opens public store URL, browses, adds to cart, checks out |

## Judge Flow
1. Sign up → 5-step wizard: business info, categories, products, theme, review
2. Store is live immediately at `/s/store-name`
3. Shopper places an order on the storefront
4. Owner sees it on admin dashboard, changes status, asks chatbot "What are my top 5 products this month?"

## Scoring
- **UI/UX: 30%** — polished, responsive, premium feel
- **Feature completeness: 30%** — all 15 checkpoints working end-to-end
- **Deployment: +10% bonus**
- Judges also test: tenant isolation, chatbot honesty

## Differentiators
1. **AI-powered store setup** — owner types one sentence, Gemini suggests categories, tagline, theme
2. **Chatbot that shows its work** — every answer includes the data table + "I don't have that data" fallback
3. **Split-screen live theme preview** — phone-sized preview beside controls
4. **CSV import with row-level error report** — not generic failure messages

## Tech Stack (Frontend)
| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | React 18 + Vite | SPA with React Router |
| Styling | Tailwind CSS + shadcn/ui (Radix) | Accessible components out of the box |
| Data fetching | TanStack Query | Loading, error, retry states for free |
| Forms | React Hook Form + Zod | Wizard + product forms with inline validation |
| Charts/Icons | Recharts + lucide-react | Dashboard charts, consistent icon set |
| Motion | Framer Motion (light) | Page and drawer transitions only (cut-list item #1) |
| Cart state | Zustand + localStorage | Cart is per store slug |

## API Contract (Frontend consumes)
| Area | Endpoints |
|------|-----------|
| Auth | POST /auth/signup, POST /auth/login, GET /auth/me |
| Wizard | POST /stores, GET /categories/predefined, POST /stores/me/categories, POST /stores/me/import-dummy, POST /ai/setup-suggestions, GET /slug-available?slug= |
| Public storefront | GET /public/{slug}, /public/{slug}/products?category&q&min&max&sort, /public/{slug}/products/{id}, POST /public/{slug}/orders, GET /public/{slug}/orders/{number}?email= |
| Products | GET/POST /products, PATCH/DELETE /products/{id}, POST /products/bulk, POST /uploads |
| CSV | GET /import/template, POST /import/preview, POST /import/validate, POST /import/commit |
| Orders | GET /orders, GET /orders/{id}, PATCH /orders/{id}/status |
| Dashboard | GET /dashboard/summary, /dashboard/revenue-series, /dashboard/activity |
| Settings | GET/PATCH /stores/me, PATCH /stores/me/theme, PATCH /stores/me/content, GET/POST /team |
| Chatbot | POST /chat, POST /chat/tool (chips, no LLM) |

## Design System (Platform)
- **Palette:** Brand indigo #4F46E5, slate neutrals, success green, warning amber, danger red
- **Typography:** Inter, scale: 12/14/16/18/20/24/30/36, body 16px on mobile
- **Spacing:** 4px base (4, 8, 12, 16, 24, 32, 48)
- **Radius:** 8 and 12
- **Shadows:** Two levels
- **Components:** Button (primary, secondary, ghost, danger), Input+label+error, Select, Card, Badge, Table, Modal, Drawer, Toast, Skeleton, EmptyState, ErrorState

## Theme System (Storefront)
CSS custom properties on storefront root:
- `--bg, --surface, --text, --muted, --primary, --primary-contrast, --radius, --font-heading, --font-body, --shadow`
- Layout variants: header style, hero style, product card style, grid density

| Theme | Look |
|-------|------|
| **Minimal** | White + near-black, Inter, 4px radius, centered hero, tight grid |
| **Vibrant** | Purple-to-pink gradient accents, Poppins, 16px radius, split hero, pill buttons |
| **Elegant** | Cream bg, deep green/gold accent, Playfair Display + Lato, thin borders, full-bleed hero, larger cards |
| **Midnight** | Dark slate, teal accent, Space Grotesk, glass-style cards, compact grid |

## Frontend Timeline
| Time | Task |
|------|------|
| 0:00–0:30 | Vite + Tailwind + shadcn scaffold, design tokens, route skeleton |
| 0:30–1:30 | Auth pages, 5-step wizard UI (mock data) |
| 1:30–3:00 | Theme system (tokens + 4 themes), storefront pages, cart, checkout |
| 3:00–4:30 | Admin shell, dashboard, products, orders, settings |
| 4:30–5:30 | CSV import UI, split-screen theme preview, chatbot panel |
| 5:30–6:15 | Responsive pass, all states, polish. **No new features** |
| 6:15–7:00 | Demo video, screenshots |

## FE-Owned Checkpoints
| # | Checkpoint | Minimum Viable |
|---|-----------|----------------|
| 1 | Onboarding form | 5-step wizard, Zod validation, logo upload |
| 2 | Category selection | Predefined chips + add-custom input |
| 5 | Theme selection | 4 themes, live phone preview, tokens + layout |
| 7 | Complete storefront | Home, category, product, search, filters, cart, checkout |
| 8 | Admin dashboard | KPIs, revenue chart, low stock, activity |
| 9 | Full content control | Logo, banners, colors, fonts, homepage sections, footer, contact |
| 10 | Product/inventory mgmt | CRUD, bulk edit, variants, stock, discounts, images |
| 11 | Order management | Status flow, timeline, simulated customer notifications |
| 15 | Fully responsive UI | Tested at 360/768/1280 on wizard, storefront, admin |

## FE+BE Shared Checkpoints (FE builds UI)
| # | Checkpoint | FE Responsibility |
|---|-----------|-------------------|
| 3 | Dummy product import | Button + feedback UI |
| 4 | Excel/CSV upload | Template download, mapping UI, preview, error report |
| 6 | Unique live URL | Route `/s/{slug}` rendering |
| 13 | AI chatbot | Floating button, side panel, suggested chips, data table rendering |
| 14 | Chatbot safety | Display "I don't have that data" message, show data provenance |

## Responsive Rules
- Mobile-first; add md (768) and lg (1280)
- No horizontal scrolling at any width
- Tables → stacked cards on mobile
- Tap targets ≥ 44×44px
- Admin sidebar → drawer + bottom nav on mobile
- Storefront grid: 2col mobile, 3col tablet, 4col desktop
- Filters → bottom sheet on mobile

## Complete States (Every Screen)
- **Loading:** Skeletons matching final layout
- **Empty:** Icon/illustration + sentence + primary action
- **Error:** Plain-language message + Retry button
- **Success:** Toast + updated UI; destructive → confirm dialog

## Cut List (in order)
1. Framer Motion / fancy transitions
2. Staff role beyond simple permission split
3. Bulk edit beyond "set stock/price for selected"
4. Homepage section reordering (keep toggle only)
5. Variants: single "Size/Option" variant per product
6. Fake status notifications: keep log entry, skip preview modal

## Never Cut
- Responsive layouts
- Empty/loading/error states
- The live URL
- Chatbot honesty rule
- README

## Environment
- `VITE_API_URL` — backend API base URL
