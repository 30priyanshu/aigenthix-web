from urllib.parse import urlparse

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_UNSAFE_METHODS = frozenset({"POST", "PUT", "DELETE", "PATCH"})


class CSRFMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method in _UNSAFE_METHODS:
            origin = request.headers.get("origin")
            referer = request.headers.get("referer")

            request_origin = origin
            if not request_origin and referer:
                parsed = urlparse(referer)
                request_origin = f"{parsed.scheme}://{parsed.netloc}"

            if request_origin:
                allowed_origins = settings.cors_origins
                if request_origin not in allowed_origins:
                    logger.warning(
                        f"CSRF origin rejected | origin={request_origin} | "
                        f"path={request.url.path} | allowed={allowed_origins}"
                    )
                    return JSONResponse(
                        status_code=403,
                        content={"detail": "Cross-origin request not allowed"},
                    )

        return await call_next(request)
