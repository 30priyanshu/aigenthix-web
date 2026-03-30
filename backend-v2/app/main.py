from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.database import database
from app.core.cache import cache_service
from app.middleware.rate_limit import limiter
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.csrf import CSRFMiddleware
from app.middleware.request_size import RequestSizeLimitMiddleware
from app.schemas.responses import HealthCheckResponse, ErrorResponse

from app.api import auth, blogs, admin, contact, careers, chat

setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app):
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {'Development' if settings.DEBUG else 'Production'}")
    logger.info(f"CORS origins: {settings.cors_origins}")
    logger.info(f"Allowed hosts: {settings.allowed_hosts}")

    from app.core.migrations import run_migrations, create_default_admin
    if not run_migrations():
        logger.warning("Database migrations failed - some features may not work")

    if settings.ADMIN_EMAIL and settings.ADMIN_PASSWORD:
        create_default_admin(settings.ADMIN_EMAIL, settings.ADMIN_PASSWORD)

    yield

    logger.info("Shutting down application")
    await asyncio.sleep(2)
    database.close_pool()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

app.state.limiter = limiter

app.add_middleware(RequestSizeLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(CSRFMiddleware)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.allowed_hosts if not settings.DEBUG else ["*"]
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=[],
)

app.include_router(auth.router)
app.include_router(blogs.router)
app.include_router(admin.router)
app.include_router(contact.router)
app.include_router(careers.router)
app.include_router(chat.router)


@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    db_healthy = database.health_check()
    cache_healthy = cache_service._available
    
    return HealthCheckResponse(
        status="healthy" if db_healthy else "unhealthy",
        version=settings.APP_VERSION,
        database=db_healthy,
        cache=cache_healthy
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal server error",
            detail=str(exc) if settings.DEBUG else "An unexpected error occurred"
        ).model_dump()
    )


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content=ErrorResponse(
            error="Rate limit exceeded",
            detail="Too many requests. Please try again later."
        ).model_dump()
    )


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
