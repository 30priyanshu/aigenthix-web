from typing import List

from fastapi import APIRouter, Depends, UploadFile, File
from pydantic import BaseModel, Field, field_validator

from app.dependencies import get_blog_service
from app.middleware.auth import get_current_user
from app.schemas.blog import BlogCreate, BlogUpdate, BlogPublic, BlogListItem
from app.schemas.responses import SuccessResponse
from app.services.blog_service import BlogService
from app.services.upload_service import upload_service

router = APIRouter(prefix="/api/admin", tags=["admin"])


class BulkActionRequest(BaseModel):
    ids: List[int] = Field(..., max_length=100)
    
    @field_validator("ids")
    @classmethod
    def validate_ids_count(cls, v: List[int]) -> List[int]:
        if len(v) > 100:
            raise ValueError("Maximum 100 IDs allowed per bulk operation")
        if len(v) == 0:
            raise ValueError("At least one ID required")
        return v


@router.get("/blogs", response_model=SuccessResponse[List[BlogListItem]])
def get_all_blogs(
    blog_service: BlogService = Depends(get_blog_service),
    current_user: dict = Depends(get_current_user),
):
    blogs = blog_service.get_all_blogs(published_only=False)
    return SuccessResponse(data=blogs)


@router.get("/blogs/{blog_id}", response_model=SuccessResponse[BlogPublic])
def get_blog(
    blog_id: int,
    blog_service: BlogService = Depends(get_blog_service),
    current_user: dict = Depends(get_current_user),
):
    blog = blog_service.get_blog_by_id(blog_id)
    return SuccessResponse(data=blog)


@router.post("/blogs", response_model=SuccessResponse[dict])
def create_blog(
    blog_data: BlogCreate,
    blog_service: BlogService = Depends(get_blog_service),
    current_user: dict = Depends(get_current_user),
):
    result = blog_service.create_blog(blog_data)
    return SuccessResponse(data=result, message="Blog created successfully")


@router.put("/blogs/{blog_id}", response_model=SuccessResponse[dict])
def update_blog(
    blog_id: int,
    blog_data: BlogUpdate,
    blog_service: BlogService = Depends(get_blog_service),
    current_user: dict = Depends(get_current_user),
):
    result = blog_service.update_blog(blog_id, blog_data)
    return SuccessResponse(data=result, message="Blog updated successfully")


@router.delete("/blogs/{blog_id}", response_model=SuccessResponse)
def delete_blog(
    blog_id: int,
    blog_service: BlogService = Depends(get_blog_service),
    current_user: dict = Depends(get_current_user),
):
    blog_service.delete_blog(blog_id)
    return SuccessResponse(message="Blog deleted successfully")


@router.patch("/blogs/{blog_id}/publish", response_model=SuccessResponse[dict])
def toggle_publish(
    blog_id: int,
    blog_service: BlogService = Depends(get_blog_service),
    current_user: dict = Depends(get_current_user),
):
    new_status = blog_service.toggle_published(blog_id)
    return SuccessResponse(
        data={"published": new_status},
        message=f"Blog {'published' if new_status else 'unpublished'}",
    )


@router.patch("/blogs/{blog_id}/featured", response_model=SuccessResponse[dict])
def toggle_featured(
    blog_id: int,
    blog_service: BlogService = Depends(get_blog_service),
    current_user: dict = Depends(get_current_user),
):
    new_status = blog_service.toggle_featured(blog_id)
    return SuccessResponse(
        data={"is_featured": new_status},
        message=f"Blog {'featured' if new_status else 'unfeatured'}",
    )


@router.post("/blogs/bulk/publish", response_model=SuccessResponse[dict])
def bulk_publish(
    request: BulkActionRequest,
    blog_service: BlogService = Depends(get_blog_service),
    current_user: dict = Depends(get_current_user),
):
    count = blog_service.bulk_publish(request.ids)
    return SuccessResponse(
        data={"affected": count},
        message=f"Published {count} blogs",
    )


@router.post("/blogs/bulk/unpublish", response_model=SuccessResponse[dict])
def bulk_unpublish(
    request: BulkActionRequest,
    blog_service: BlogService = Depends(get_blog_service),
    current_user: dict = Depends(get_current_user),
):
    count = blog_service.bulk_unpublish(request.ids)
    return SuccessResponse(
        data={"affected": count},
        message=f"Unpublished {count} blogs",
    )


@router.post("/blogs/bulk/delete", response_model=SuccessResponse[dict])
def bulk_delete(
    request: BulkActionRequest,
    blog_service: BlogService = Depends(get_blog_service),
    current_user: dict = Depends(get_current_user),
):
    count = blog_service.bulk_delete(request.ids)
    return SuccessResponse(
        data={"affected": count},
        message=f"Deleted {count} blogs",
    )


@router.post("/upload/image", response_model=SuccessResponse[dict])
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    url = await upload_service.upload_image(file)
    return SuccessResponse(
        data={"url": url},
        message="Image uploaded successfully",
    )
