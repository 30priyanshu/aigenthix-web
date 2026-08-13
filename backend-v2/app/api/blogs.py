"""
Public blog API routes (no authentication required).
"""
from fastapi import APIRouter, Depends, Request

from app.dependencies import get_blog_service
from app.middleware.rate_limit import limiter
from app.schemas.blog import BlogPublic, BlogPageData
from app.schemas.responses import SuccessResponse
from app.services.blog_service import BlogService

router = APIRouter(prefix="/api/blogs", tags=["blogs"])


@router.get("/page-data", response_model=SuccessResponse[BlogPageData])
def get_blog_page_data(blog_service: BlogService = Depends(get_blog_service)):
    """
    Get all blog page data in a single optimized request.
    Includes: featured blog, latest blogs, popular blogs, categories.
    Cached for 5 minutes.
    """
    data = blog_service.get_page_data()
    return SuccessResponse(data=data)


@router.get("/check-slug", response_model=SuccessResponse[bool])
def check_slug(slug: str, blog_service: BlogService = Depends(get_blog_service)):
    """
    Check if a slug is available. Returns true if available (not duplicate).
    """
    try:
        existing = blog_service.get_blog_by_slug(slug, preview=True)
        return SuccessResponse(data=False) # Not available
    except Exception:
        return SuccessResponse(data=True) # Available

@router.get("/{slug}", response_model=SuccessResponse[BlogPublic])
def get_blog_by_slug(slug: str, preview: bool = False, blog_service: BlogService = Depends(get_blog_service)):
    """
    Get a single published blog by slug. If preview=True, can fetch drafts.
    Cached for 10 minutes (except for previews).
    """
    blog = blog_service.get_blog_by_slug(slug, preview=preview)
    return SuccessResponse(data=blog)


@router.post("/{slug}/view", response_model=SuccessResponse[bool])
@limiter.limit("5/minute")
def increment_views(
    request: Request,
    slug: str,
    blog_service: BlogService = Depends(get_blog_service)
):
    """
    Increment blog view count.
    Rate limited to 5 requests per minute per IP.
    """
    success = blog_service.increment_views(slug)
    return SuccessResponse(data=success)
