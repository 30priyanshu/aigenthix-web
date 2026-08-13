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
    featured_image_url: Optional[str] = Field(None)
    featured_image_alt: Optional[str] = Field(None, max_length=500)
    
    schema_type: Optional[str] = Field("Article", max_length=50)
    canonical_url: Optional[str] = Field(None, max_length=1000)
    show_toc: bool = False
    
    author_id: Optional[int] = Field(None)
    author_ids: Optional[List[int]] = Field(default_factory=list)
    author_name: Optional[str] = Field(None, max_length=200)
    author_title: Optional[str] = Field(None, max_length=200)
    author_bio: Optional[str] = Field(None, max_length=1000)
    author_avatar_url: Optional[str] = Field(None, max_length=500)
    author_twitter: Optional[str] = Field(None, max_length=200)
    author_linkedin: Optional[str] = Field(None, max_length=200)
    author_facebook: Optional[str] = Field(None, max_length=200)
    author_instagram: Optional[str] = Field(None, max_length=200)
    author_github: Optional[str] = Field(None, max_length=200)
    author_website: Optional[str] = Field(None, max_length=200)
    
    fact_checker_name: Optional[str] = Field(None, max_length=200)
    fact_checker_bio: Optional[str] = Field(None, max_length=1000)
    fact_checker_avatar_url: Optional[str] = Field(None, max_length=500)
    fact_checker_ids: Optional[List[int]] = Field(default_factory=list)
    
    faqs: Optional[List[dict]] = Field(default_factory=list)
    
    meta_title: Optional[str] = Field(None, max_length=500)
    meta_description: Optional[str] = Field(None, max_length=1000)
    meta_keywords: Optional[str] = Field(None, max_length=500)
    
    cta_text: Optional[str] = Field(None, max_length=100)
    cta_url: Optional[str] = Field(None, max_length=500)
    cta_style: Optional[str] = Field("primary", max_length=50)
    cta_position: Optional[str] = Field("bottom", max_length=50)
    
    ad_category: Optional[str] = Field(None, max_length=100)
    
    published: bool = False
    is_featured: bool = False
    status: str = Field("draft", max_length=20)
    
    @field_validator("featured_image_url", "cta_url", "author_website", mode="before")
    @classmethod
    def validate_url_scheme(cls, v: Optional[str]) -> Optional[str]:
        if v and v.strip() and not v.startswith(("https://", "http://", "data:image")):
            raise ValueError("URL must start with https://, http://, or be a valid base64 image (data:image...)")
        return v

    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags(cls, v):
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
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
    featured_image_alt: Optional[str] = None
    schema_type: Optional[str] = "Article"
    canonical_url: Optional[str] = None
    show_toc: bool = False
    author_id: Optional[int] = None
    author_ids: Optional[List[int]] = Field(default_factory=list)
    authors_data: Optional[List[dict]] = Field(default_factory=list)
    author_name: Optional[str]
    author_title: Optional[str]
    author_bio: Optional[str]
    author_avatar_url: Optional[str]
    author_twitter: Optional[str]
    author_linkedin: Optional[str]
    author_facebook: Optional[str]
    author_instagram: Optional[str]
    author_github: Optional[str]
    author_website: Optional[str]
    fact_checker_name: Optional[str] = None
    fact_checker_bio: Optional[str] = None
    fact_checker_avatar_url: Optional[str] = None
    fact_checker_ids: Optional[List[int]] = Field(default_factory=list)
    fact_checkers_data: Optional[List[dict]] = Field(default_factory=list)
    faqs: Optional[List[dict]] = None
    meta_title: Optional[str]
    meta_description: Optional[str]
    meta_keywords: Optional[str]
    cta_text: Optional[str]
    cta_url: Optional[str]
    cta_style: Optional[str]
    cta_position: Optional[str]
    ad_category: Optional[str] = None
    read_time: int
    published: bool
    is_featured: bool
    status: str
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
    authors_data: Optional[List[dict]] = Field(default_factory=list)
    author_name: Optional[str]
    fact_checker_ids: Optional[List[int]] = Field(default_factory=list)
    fact_checkers_data: Optional[List[dict]] = Field(default_factory=list)
    ad_category: Optional[str] = None
    read_time: int
    published: bool
    is_featured: bool
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class BlogPageData(BaseModel):
    featured: Optional[BlogListItem]
    latest: List[BlogListItem]
    popular: List[BlogListItem]
    categories: List[dict]
