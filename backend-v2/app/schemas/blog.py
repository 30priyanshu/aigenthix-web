from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, HttpUrl
from slugify import slugify


class BlogBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1, max_length=100000)
    excerpt: Optional[str] = Field(None, max_length=1000)
    slug: Optional[str] = Field(None, max_length=200)
    category: Optional[str] = Field(None, max_length=100)
    tags: List[str] = Field(default_factory=list)
    featured_image_url: Optional[str] = Field(None, max_length=500)
    
    author_name: Optional[str] = Field(None, max_length=200)
    author_bio: Optional[str] = Field(None, max_length=1000)
    author_avatar_url: Optional[str] = Field(None, max_length=500)
    author_twitter: Optional[str] = Field(None, max_length=200)
    author_linkedin: Optional[str] = Field(None, max_length=200)
    author_facebook: Optional[str] = Field(None, max_length=200)
    author_instagram: Optional[str] = Field(None, max_length=200)
    author_github: Optional[str] = Field(None, max_length=200)
    author_website: Optional[str] = Field(None, max_length=200)
    
    cta_text: Optional[str] = Field(None, max_length=100)
    cta_url: Optional[str] = Field(None, max_length=500)
    cta_style: Optional[str] = Field("primary", max_length=50)
    cta_position: Optional[str] = Field("bottom", max_length=50)
    
    published: bool = False
    is_featured: bool = False
    
    @field_validator("featured_image_url", "cta_url", "author_website", mode="before")
    @classmethod
    def validate_url_scheme(cls, v: Optional[str]) -> Optional[str]:
        if v and v.strip() and not v.startswith(("https://", "http://")):
            raise ValueError("URL must start with https:// or http://")
        return v


class BlogCreate(BlogBase):
    @field_validator("slug", mode="before")
    @classmethod
    def generate_slug(cls, v, info):
        if v:
            return slugify(v)
        if "title" in info.data:
            return slugify(info.data["title"])
        return None


class BlogUpdate(BlogBase):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    content: Optional[str] = Field(None, min_length=1)


class BlogInDB(BlogBase):
    id: int
    read_time: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class BlogPublic(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    content: str
    category: Optional[str]
    tags: List[str]
    featured_image_url: Optional[str]
    author_name: Optional[str]
    author_bio: Optional[str]
    author_avatar_url: Optional[str]
    author_twitter: Optional[str]
    author_linkedin: Optional[str]
    author_facebook: Optional[str]
    author_instagram: Optional[str]
    author_github: Optional[str]
    author_website: Optional[str]
    cta_text: Optional[str]
    cta_url: Optional[str]
    cta_style: Optional[str]
    cta_position: Optional[str]
    read_time: int
    published: bool
    is_featured: bool
    created_at: datetime
    updated_at: datetime


class BlogListItem(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    category: Optional[str]
    tags: List[str]
    featured_image_url: Optional[str]
    author_name: Optional[str]
    read_time: int
    published: bool
    is_featured: bool
    created_at: datetime


class BlogPageData(BaseModel):
    featured: Optional[BlogListItem]
    latest: List[BlogListItem]
    popular: List[BlogListItem]
    categories: List[dict]
