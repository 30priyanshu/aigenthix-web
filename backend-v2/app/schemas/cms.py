from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional


# --- PRODUCTS ---
class ProductBase(BaseModel):
    title: str = Field(..., max_length=500)
    slug: str = Field(..., max_length=500)
    description: Optional[str] = None
    features: Optional[str] = None
    image_url: Optional[str] = Field(None)
    hero_image_url: Optional[str] = Field(None)
    demo_video_url: Optional[str] = Field(None)
    demo_description: Optional[str] = None
    highlights: Optional[str] = None
    status: Optional[str] = Field("draft", max_length=20)
    is_featured: Optional[bool] = False
    content_data: Optional[dict] = Field(default_factory=dict)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    slug: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = None
    features: Optional[str] = None
    image_url: Optional[str] = Field(None)
    hero_image_url: Optional[str] = Field(None)
    demo_video_url: Optional[str] = Field(None)
    demo_description: Optional[str] = None
    highlights: Optional[str] = None
    status: Optional[str] = Field(None, max_length=20)
    is_featured: Optional[bool] = None
    content_data: Optional[dict] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# --- SERVICES ---
class ServiceBase(BaseModel):
    title: str = Field(..., max_length=500)
    slug: str = Field(..., max_length=500)
    description: Optional[str] = None
    benefits: Optional[str] = None
    icon_url: Optional[str] = Field(None)
    status: Optional[str] = Field("draft", max_length=20)
    is_featured: Optional[bool] = False
    content_data: Optional[dict] = Field(default_factory=dict)

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    slug: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = None
    benefits: Optional[str] = None
    icon_url: Optional[str] = Field(None)
    strategy_title: Optional[str] = Field(None, max_length=500)
    strategy_description: Optional[str] = None
    strategy_tags: Optional[str] = None
    strategy_image_url: Optional[str] = Field(None)
    business_title: Optional[str] = Field(None, max_length=500)
    business_description: Optional[str] = None
    business_tags: Optional[str] = None
    business_image_url: Optional[str] = Field(None)
    cta_title: Optional[str] = Field(None, max_length=500)
    cta_description: Optional[str] = None
    cta_text: Optional[str] = Field(None, max_length=200)
    cta_url: Optional[str] = Field(None)
    status: Optional[str] = Field(None, max_length=20)
    is_featured: Optional[bool] = None
    content_data: Optional[dict] = None

class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# --- INDUSTRIES ---
class IndustryBase(BaseModel):
    name: str = Field(..., max_length=500)
    slug: str = Field(..., max_length=500)
    description: Optional[str] = None
    image_url: Optional[str] = Field(None)
    capabilities: Optional[str] = None
    strategy_title: Optional[str] = Field(None, max_length=500)
    strategy_description: Optional[str] = None
    strategy_image_url: Optional[str] = Field(None)
    cta_title: Optional[str] = Field(None, max_length=500)
    cta_description: Optional[str] = None
    cta_text: Optional[str] = Field(None, max_length=200)
    cta_url: Optional[str] = Field(None)
    status: Optional[str] = Field("draft", max_length=20)
    is_featured: Optional[bool] = False
    content_data: Optional[dict] = Field(default_factory=dict)

class IndustryCreate(IndustryBase):
    pass

class IndustryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=500)
    slug: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = None
    image_url: Optional[str] = Field(None)
    capabilities: Optional[str] = None
    strategy_title: Optional[str] = Field(None, max_length=500)
    strategy_description: Optional[str] = None
    strategy_image_url: Optional[str] = Field(None)
    cta_title: Optional[str] = Field(None, max_length=500)
    cta_description: Optional[str] = None
    cta_text: Optional[str] = Field(None, max_length=200)
    cta_url: Optional[str] = Field(None)
    status: Optional[str] = Field(None, max_length=20)
    is_featured: Optional[bool] = None
    content_data: Optional[dict] = None

class IndustryResponse(IndustryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# --- R&D ---
class RDBase(BaseModel):
    project_name: str = Field(..., max_length=500)
    slug: str = Field(..., max_length=500)
    summary: Optional[str] = None
    details: Optional[str] = None
    status: Optional[str] = Field("draft", max_length=20)
    is_featured: Optional[bool] = False
    content_data: Optional[dict] = Field(default_factory=dict)

class RDCreate(RDBase):
    pass

class RDUpdate(BaseModel):
    project_name: Optional[str] = Field(None, max_length=500)
    slug: Optional[str] = Field(None, max_length=500)
    summary: Optional[str] = None
    details: Optional[str] = None
    status: Optional[str] = Field(None, max_length=20)
    is_featured: Optional[bool] = None
    content_data: Optional[dict] = None

class RDResponse(RDBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
