# 🚀 Launch-Your-Store

> **AI-Powered No-Code E-Commerce Storefront Builder for Modern Merchants**  
> Build, customize, and launch a complete online store in under 2 minutes with AI-assisted onboarding, 4 dynamic themes, real-time inventory management, CSV batch importing, and an intelligent dual-failover LLM store assistant.

---

## 🌟 Architecture & System Design

```mermaid
graph TD
    Client["Shopper & Merchant Browser (React 18 + Vite + Tailwind)"]
    
    subgraph Frontend["Frontend SPA (Zustand State Engines)"]
        UI["10 Route Views (Wizard, Themes, Storefront, Admin, Cart)"]
        Zustand["Zustand Stores (useAuthStore, useStoreData, useCartStore)"]
        APIClient["API Client (src/lib/api.js)"]
    end
    
    subgraph Gateway["Fullstack Edge Gateway (Vercel Serverless / Docker)"]
        Vercel["vercel.json /api/index.py Rewrite Engine"]
        FastAPI["FastAPI 0.115 Application (app/main.py)"]
    end

    subgraph Backend["Multi-Tenant Backend Services"]
        Auth["JWT Multi-Tenant Auth & RBAC (app/auth.py)"]
        Routers["Tenanted Routers (Public, Orders, Products, Dashboard, Stores)"]
        Importer["Fuzzy CSV Engine (app/services/csv_importer.py)"]
        AI["Dual-LLM Engine (Gemini 2.5 Flash ➔ Groq LLaMA 3.1 ➔ Local Heuristics)"]
    end

    subgraph Database["Cloud Database Layer"]
        Supabase["Supabase PostgreSQL 17 (Transaction Pooler port 6543)"]
        Tables["9 SQLAlchemy Models with Multi-Tenant Isolation"]
    end

    Client --> UI
    UI --> Zustand
    Zustand --> APIClient
    APIClient --> Gateway
    Gateway --> FastAPI
    FastAPI --> Auth
    FastAPI --> Routers
    FastAPI --> Importer
    FastAPI --> AI
    Routers --> Supabase
    AI --> Supabase
```

---

## ⚡ 15 Hackathon Feature Checkpoints Implemented

| # | Checkpoint | Status | Implementation Details |
|---|---|---|---|
| 1 | **Onboarding Wizard** | ✅ Complete | 5-step interactive wizard with live phone preview, Zod validation, auto draft saving |
| 2 | **Category Management** | ✅ Complete | Predefined chip tags with emojis, custom category addition, and store linking |
| 3 | **Dummy Product Seeder** | ✅ Complete | 1-click catalog population with realistic product images, INR pricing, and SKU tracking |
| 4 | **CSV Importer** | ✅ Complete | Fuzzy header mapping (`Name`, `Price`, `Stock`, `SKU`), currency parser (`₹`), and row-level error table |
| 5 | **Theme Engine** | ✅ Complete | 4 distinct themes (*Minimal, Vibrant, Elegant, Midnight*) configured via dynamic CSS custom properties |
| 6 | **Live Store URL** | ✅ Complete | Immediate custom URL (`/s/:slug`) upon completion with QR Code generation & clipboard copy |
| 7 | **Complete Storefront** | ✅ Complete | Dynamic hero banner, category filters, real-time search, responsive grid, and product modal |
| 8 | **Cart & Checkout** | ✅ Complete | Slide-out cart drawer, single-page express checkout, and celebratory confetti animation |
| 9 | **Admin Dashboard** | ✅ Complete | Real-time KPI summary cards (Gross Revenue, Orders, AOV, Low Stock) and 7-day revenue charts |
| 10 | **Inventory CRUD** | ✅ Complete | Create, edit, search, and delete products, plus inline stock editing & bulk restock actions |
| 11 | **Order Management** | ✅ Complete | Status progression (*Placed ➔ Packed ➔ Shipped ➔ Delivered*), price snapshots, and timeline |
| 12 | **Simulated Notifications** | ✅ Complete | Event logs simulating instant customer SMS & WhatsApp updates upon fulfillment status transitions |
| 13 | **Multi-Tenant RBAC** | ✅ Complete | Owner vs Staff permission guards. Staff accounts are blocked with 404 non-leakage from settings |
| 14 | **Dual-Failover AI Chatbot** | ✅ Complete | Floating assistant querying 6 backend tools via Gemini 2.5 Flash with automatic failover to Groq LLaMA 3.1 |
| 15 | **Responsive Design** | ✅ Complete | Pixel-perfect layout tested across 360px mobile, 768px tablet, and 1280px desktop screens |

---

## 🔑 Demo Accounts & Pre-Seeded Store

The database has been seeded with realistic store data ready for immediate review:

| Role | Email Address | Password | Store Context |
|---|---|---|---|
| **Owner** | `owner@launchstore.com` | `Password123` | Aura Artisan Studio (`demo-store`) |
| **Staff** | `staff@launchstore.com` | `Password123` | Aura Artisan Studio (`demo-store`) |

- **Live Storefront URL:** `/s/demo-store`
- **Catalog Size:** 11 active handcrafted products across 4 categories
- **Order History:** 35 realistic orders spanning 30 days for revenue graph rendering
- **Instant Role Switcher:** Quick-toggle buttons on the login screen (`Owner Mode` & `Staff Mode`) for judge testing

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher) & **npm**
- **Python** (v3.10 or higher)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/shouryasingh2311/Launch-Your-Store.git
cd Launch-Your-Store

# Copy example environment configuration
cp .env.example .env
```

Ensure your `.env` contains:
```ini
DATABASE_URL=postgresql://postgres.xxx:xxx@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
JWT_SECRET=super-secret-jwt-key-minimum-32-chars
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
FRONTEND_ORIGIN=http://localhost:5173
```

### 2. Backend Setup
```bash
# Create and activate Python virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run automated test suite
pytest

# Launch FastAPI development server (port 8000)
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
In a second terminal:
```bash
# Install frontend packages
npm install

# Start Vite dev server with automated backend proxy (port 5173)
npm run dev
```

Visit `http://localhost:5173` to explore the application!

---

## 🐳 Docker Deployment

The project includes a production-ready, multi-stage `Dockerfile` and `docker-compose.yml` that builds the React application and serves both frontend and backend through Uvicorn on a single port:

```bash
# Build and run containerized application
docker-compose up --build -d

# View live application logs
docker-compose logs -f
```

The unified app is accessible at `http://localhost:8000`.

---

## ☁️ Vercel Hosting Guide

This project is configured for 1-click deployment on [Vercel](https://vercel.com):

1. **Import Repository:**
   - Link `https://github.com/shouryasingh2311/Launch-Your-Store` in your Vercel Dashboard.
2. **Framework Preset:**
   - Select **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables:**
   Add the following in Vercel **Project Settings ➔ Environment Variables**:
   - `DATABASE_URL`: Your Supabase PostgreSQL pooler connection URI
   - `JWT_SECRET`: Random 32+ character secret string
   - `GEMINI_API_KEY`: Google Gemini API key
   - `GROQ_API_KEY`: Groq API key
   - `FRONTEND_ORIGIN`: Your production Vercel domain (e.g. `https://your-app.vercel.app`)
4. **Deploy:**
   - Click **Deploy**. Vercel will build the frontend assets into global CDN edge nodes and serve Python endpoints via serverless function routes (`/api/index.py` configured via `vercel.json`).

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Live system & database connection health check | None |
| `POST` | `/auth/signup` | Register new store owner | None |
| `POST` | `/auth/login` | Authenticate merchant and issue JWT | None |
| `GET` | `/auth/me` | Current authenticated user profile | Bearer Token |
| `GET` | `/public/{slug}` | Public storefront branding, content & categories | None |
| `GET` | `/public/{slug}/products`| Public catalog with category filter, query & sort | None |
| `POST` | `/public/{slug}/orders` | Submit shopper order & reserve inventory | None |
| `GET` | `/dashboard/summary` | Merchant KPI metrics (revenue, orders, AOV, stock) | Bearer (Staff/Owner) |
| `GET` | `/dashboard/revenue-trend` | 7-day to 30-day zero-filled revenue time series | Bearer (Staff/Owner) |
| `GET` | `/products/` | Merchant inventory list with search & filters | Bearer (Staff/Owner) |
| `POST` | `/products/` | Create a new product in the store catalog | Bearer (Staff/Owner) |
| `PATCH`| `/products/{id}/stock` | Quick inline inventory adjustment | Bearer (Staff/Owner) |
| `DELETE`| `/products/{id}` | Remove product from store | Bearer (Staff/Owner) |
| `GET` | `/orders/` | Order management dashboard list | Bearer (Staff/Owner) |
| `PATCH`| `/orders/{id}/status` | Advance fulfillment status with notification alert | Bearer (Staff/Owner) |
| `POST` | `/chat` | Conversational AI assistant query with DB tools | Bearer (Staff/Owner) |
| `POST` | `/chat/tool` | Direct deterministic analytics tool invocation | Bearer (Staff/Owner) |
| `POST` | `/import/csv` | Bulk product CSV upload with error diagnostics | Bearer (Staff/Owner) |
| `GET` | `/team/` | Team member list | Bearer (Staff/Owner) |
| `POST` | `/team/` | Invite team member (Owner only) | Bearer (Owner) |
| `DELETE`| `/team/{id}` | Revoke staff permissions (Owner only) | Bearer (Owner) |

---

## 🔒 Security & Data Integrity

- **Strict Multi-Tenant Isolation:** Every query enforces `store_id == tenant.store_id`. Unassigned resources return HTTP 404 to prevent resource enumeration.
- **Zero Schema Leakage:** A custom global exception filter intercepts internal database traces and delivers safe, generic errors to end users.
- **Dual AI Provider Failover:** Automatic fallback from Google Gemini 2.5 Flash to Groq LLaMA 3.1 Instant to local deterministic SQL tools prevents downtime during API rate limits.
- **Zero Secrets in Code:** Sensitive credentials exist strictly in environment variables; `.env` is verified in `.gitignore`.
