from fastapi import Depends

from app.core.database import get_db
from app.repositories.blog_repository import BlogRepository
from app.services.blog_service import BlogService


def get_blog_service(cursor=Depends(get_db)) -> BlogService:
    return BlogService(BlogRepository(cursor))

