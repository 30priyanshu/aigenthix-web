from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from psycopg2.extensions import cursor as PgCursor

from app.core.database import get_db
from app.repositories.cms_repository import CMSRepository
from app.schemas import cms as schemas

router = APIRouter(prefix="/cms", tags=["Universal CMS"])

def get_cms_repo(db: PgCursor = Depends(get_db)) -> CMSRepository:
    return CMSRepository(db)

# --- PRODUCTS ---
@router.post("/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, repo: CMSRepository = Depends(get_cms_repo)):
    return repo.create_product(product.model_dump(exclude_unset=True))

@router.get("/products", response_model=List[schemas.ProductResponse])
def get_products(repo: CMSRepository = Depends(get_cms_repo)):
    return repo.get_products()

@router.get("/products/{id}", response_model=schemas.ProductResponse)
def get_product(id: int, repo: CMSRepository = Depends(get_cms_repo)):
    product = repo.get_product(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/products/{id}", response_model=schemas.ProductResponse)
def update_product(id: int, product: schemas.ProductUpdate, repo: CMSRepository = Depends(get_cms_repo)):
    updated = repo.update_product(id, product.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated

@router.delete("/products/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(id: int, repo: CMSRepository = Depends(get_cms_repo)):
    if not repo.delete_product(id):
        raise HTTPException(status_code=404, detail="Product not found")
    return None


# --- SERVICES ---
@router.post("/services", response_model=schemas.ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(service: schemas.ServiceCreate, repo: CMSRepository = Depends(get_cms_repo)):
    return repo.create_service(service.model_dump(exclude_unset=True))

@router.get("/services", response_model=List[schemas.ServiceResponse])
def get_services(repo: CMSRepository = Depends(get_cms_repo)):
    return repo.get_services()

@router.get("/services/{id}", response_model=schemas.ServiceResponse)
def get_service(id: int, repo: CMSRepository = Depends(get_cms_repo)):
    service = repo.get_service(id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.put("/services/{id}", response_model=schemas.ServiceResponse)
def update_service(id: int, service: schemas.ServiceUpdate, repo: CMSRepository = Depends(get_cms_repo)):
    updated = repo.update_service(id, service.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Service not found")
    return updated

@router.delete("/services/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(id: int, repo: CMSRepository = Depends(get_cms_repo)):
    if not repo.delete_service(id):
        raise HTTPException(status_code=404, detail="Service not found")
    return None


# --- INDUSTRIES ---
@router.post("/industries", response_model=schemas.IndustryResponse, status_code=status.HTTP_201_CREATED)
def create_industry(industry: schemas.IndustryCreate, repo: CMSRepository = Depends(get_cms_repo)):
    return repo.create_industry(industry.model_dump(exclude_unset=True))

@router.get("/industries", response_model=List[schemas.IndustryResponse])
def get_industries(repo: CMSRepository = Depends(get_cms_repo)):
    return repo.get_industries()

@router.get("/industries/{id}", response_model=schemas.IndustryResponse)
def get_industry(id: int, repo: CMSRepository = Depends(get_cms_repo)):
    industry = repo.get_industry(id)
    if not industry:
        raise HTTPException(status_code=404, detail="Industry not found")
    return industry

@router.put("/industries/{id}", response_model=schemas.IndustryResponse)
def update_industry(id: int, industry: schemas.IndustryUpdate, repo: CMSRepository = Depends(get_cms_repo)):
    updated = repo.update_industry(id, industry.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Industry not found")
    return updated

@router.delete("/industries/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_industry(id: int, repo: CMSRepository = Depends(get_cms_repo)):
    if not repo.delete_industry(id):
        raise HTTPException(status_code=404, detail="Industry not found")
    return None


# --- R&D ---
@router.post("/rd", response_model=schemas.RDResponse, status_code=status.HTTP_201_CREATED)
def create_rd(rd: schemas.RDCreate, repo: CMSRepository = Depends(get_cms_repo)):
    return repo.create_rd(rd.model_dump(exclude_unset=True))

@router.get("/rd", response_model=List[schemas.RDResponse])
def get_rds(repo: CMSRepository = Depends(get_cms_repo)):
    return repo.get_rds()

@router.get("/rd/{id}", response_model=schemas.RDResponse)
def get_rd(id: int, repo: CMSRepository = Depends(get_cms_repo)):
    rd = repo.get_rd(id)
    if not rd:
        raise HTTPException(status_code=404, detail="R&D project not found")
    return rd

@router.put("/rd/{id}", response_model=schemas.RDResponse)
def update_rd(id: int, rd: schemas.RDUpdate, repo: CMSRepository = Depends(get_cms_repo)):
    updated = repo.update_rd(id, rd.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="R&D project not found")
    return updated

@router.delete("/rd/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rd(id: int, repo: CMSRepository = Depends(get_cms_repo)):
    if not repo.delete_rd(id):
        raise HTTPException(status_code=404, detail="R&D project not found")
    return None
