from contextlib import asynccontextmanager
from typing import Any

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import settings
from app.database import Base, engine, get_db
# Import all models so Base.metadata knows about them
import app.models  # noqa: F401
from app.routers import auth, categories, orders, products, public, stores


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup (fast hackathon approach per architecture doc)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Launch-Your-Store API",
    description="Multi-tenant backend for no-code e-commerce store builder with AI assistant.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
origins = [
    settings.FRONTEND_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(auth.router)
app.include_router(stores.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(public.router)
app.include_router(orders.router)


@app.get("/", tags=["General"])
def root() -> dict[str, Any]:
    return {
        "app": "Launch-Your-Store API",
        "status": "online",
        "documentation": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)) -> dict[str, str]:
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database unreachable: {str(exc)}") from exc

    return {
        "status": "ok",
        "database": db_status,
        "mode": "production" if "pooler" in settings.DATABASE_URL else "local",
    }

