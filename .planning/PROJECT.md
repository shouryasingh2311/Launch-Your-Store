# PROJECT.md — Launch-Your-Store (Fullstack)

## Identity
- **Project:** Launch-Your-Store
- **Repo:** [shouryasingh2311/Launch-Your-Store](https://github.com/shouryasingh2311/Launch-Your-Store)
- **Problem:** Problem 1 — No-code store builder with AI assistant (Cypher Hackathon, MyStartupWave)
- **Team Split:** 2-person team
  - **Backend:** FastAPI + PostgreSQL + SQLAlchemy + PyJWT + Gemini SDK
  - **Frontend:** React 18 + Vite + Tailwind CSS + shadcn/ui + Recharts + Zustand

## Tech Stack
- **Backend:** Python 3.12, FastAPI, SQLAlchemy 2.0, Pydantic v2, PyJWT, bcrypt, psycopg2-binary
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide icons, Recharts, Zustand
- **Database:** PostgreSQL (multi-tenant by `store_id`)
- **Deployment:** Vercel (FastAPI serverless backend + static Vite frontend)

## 15 Hackathon Checkpoints Coverage
1. Onboarding form (5-step wizard, Zod validation, logo upload)
2. Category selection (predefined chips + custom input)
3. Dummy product import (1-click seed endpoint & client handler)
4. Excel/CSV upload (template, auto-mapping, row diagnostic error report)
5. Theme selection (4 themes: Minimal, Vibrant, Elegant, Midnight + live phone preview)
6. Unique live URL (/s/{slug} published immediately)
7. Complete storefront (hero, categories, product grid, cart drawer, checkout modal)
8. Admin dashboard (KPI cards, continuous revenue series, low stock alerts)
9. Full content control (logo, banners, colors, fonts, homepage sections, footer)
10. Product/inventory management (CRUD, bulk edit, variants, stock, discounts, images)
11. Order management (status flow, timeline history, simulated customer notifications)
12. Tenant isolation + roles (store_id scoping, owner vs staff role guards)
13. AI chatbot (FastAPI query tools + client slide-out panel with data tables)
14. Chatbot safety & honesty (read-only, tenant-isolated, "I don't have that data" fallback)
15. Fully responsive UI (mobile-first tested at 360, 768, and 1280px)
