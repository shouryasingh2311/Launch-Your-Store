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
from app.routers import ai, auth, categories, dashboard, imports, orders, products, public, stores, team


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup (fast hackathon approach per architecture doc)
    Base.metadata.create_all(bind=engine)
    yield


import logging
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("uvicorn.error")

app = FastAPI(
    title="Launch-Your-Store API",
    description="Multi-tenant backend for no-code e-commerce store builder with AI assistant.",
    version="1.0.0",
    lifespan=lifespan,
)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception):
    """Sanitize all internal errors to prevent database schema/traceback leakage."""
    if isinstance(exc, (HTTPException, StarletteHTTPException)):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    logger.error(f"Internal error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."},
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
app.include_router(dashboard.router)
app.include_router(team.router)
app.include_router(imports.router)
app.include_router(ai.router)

# Mount /api prefix router alias for serverless and reverse proxy compatibility
from fastapi import APIRouter
api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(stores.router)
api_router.include_router(categories.router)
api_router.include_router(products.router)
api_router.include_router(public.router)
api_router.include_router(orders.router)
api_router.include_router(dashboard.router)
api_router.include_router(team.router)
api_router.include_router(imports.router)
api_router.include_router(ai.router)


@api_router.get("/health", tags=["Health"])
def api_health_check(db: Session = Depends(get_db)) -> dict[str, str]:
    return health_check(db)


app.include_router(api_router)


import os
from starlette.requests import Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


@app.get("/", tags=["General"])
def root(request: Request) -> Any:
    accept = request.headers.get("accept", "")
    if "text/html" in accept and os.path.isfile("dist/index.html"):
        return FileResponse("dist/index.html")
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


if os.path.isdir("dist"):
    if os.path.isdir("dist/assets"):
        app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str, request: Request):
        if full_path.startswith(("docs", "openapi.json", "redoc", "api/")):
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = os.path.join("dist", full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        accept = request.headers.get("accept", "")
        if "text/html" in accept or "*/*" in accept:
            return FileResponse(os.path.join("dist", "index.html"))
        raise HTTPException(status_code=404, detail="Not Found")

