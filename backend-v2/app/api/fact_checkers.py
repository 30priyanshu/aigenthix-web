from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import get_db
from app.middleware.auth import get_current_user
from app.schemas.responses import SuccessResponse
from psycopg2.extensions import cursor as PgCursor

router = APIRouter(prefix="/api/admin/factcheckers", tags=["factcheckers"])

class FactCheckerCreate(BaseModel):
    name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None

class FactCheckerResponse(FactCheckerCreate):
    id: int

@router.get("", response_model=SuccessResponse[List[FactCheckerResponse]])
def get_fact_checkers(cursor: PgCursor = Depends(get_db)):
    cursor.execute("SELECT * FROM fact_checkers ORDER BY name ASC")
    fact_checkers = cursor.fetchall()
    return SuccessResponse(data=fact_checkers)

@router.post("", response_model=SuccessResponse[FactCheckerResponse])
def create_fact_checker(
    fact_checker: FactCheckerCreate,
    current_user: dict = Depends(get_current_user),
    cursor: PgCursor = Depends(get_db)
):
    query = """
        INSERT INTO fact_checkers (name, bio, avatar_url, twitter, linkedin, facebook, instagram, github, website)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *
    """
    params = (
        fact_checker.name, fact_checker.bio, fact_checker.avatar_url, fact_checker.twitter, fact_checker.linkedin,
        fact_checker.facebook, fact_checker.instagram, fact_checker.github, fact_checker.website
    )
    cursor.execute(query, params)
    result = cursor.fetchone()
    cursor.connection.commit()
    return SuccessResponse(data=result, message="Fact Checker created successfully")

@router.put("/{fact_checker_id}", response_model=SuccessResponse[FactCheckerResponse])
def update_fact_checker(
    fact_checker_id: int,
    fact_checker: FactCheckerCreate,
    current_user: dict = Depends(get_current_user),
    cursor: PgCursor = Depends(get_db)
):
    query = """
        UPDATE fact_checkers
        SET name = %s, bio = %s, avatar_url = %s, twitter = %s, linkedin = %s,
            facebook = %s, instagram = %s, github = %s, website = %s, updated_at = CURRENT_TIMESTAMP
        WHERE id = %s RETURNING *
    """
    params = (
        fact_checker.name, fact_checker.bio, fact_checker.avatar_url, fact_checker.twitter, fact_checker.linkedin,
        fact_checker.facebook, fact_checker.instagram, fact_checker.github, fact_checker.website, fact_checker_id
    )
    cursor.execute(query, params)
    result = cursor.fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Fact Checker not found")
        
    cursor.connection.commit()
    return SuccessResponse(data=result, message="Fact Checker updated successfully")

@router.delete("/{fact_checker_id}", response_model=SuccessResponse)
def delete_fact_checker(
    fact_checker_id: int,
    current_user: dict = Depends(get_current_user),
    cursor: PgCursor = Depends(get_db)
):
    # Cascade delete: Remove from fact_checker_ids JSONB array
    query_fc = """
        UPDATE blogs 
        SET fact_checker_ids = COALESCE((
            SELECT jsonb_agg(elem) 
            FROM jsonb_array_elements(fact_checker_ids) elem 
            WHERE elem::text != %s
        ), '[]'::jsonb)
        WHERE fact_checker_ids @> %s::jsonb
    """
    cursor.execute(query_fc, (str(fact_checker_id), f"[{fact_checker_id}]"))
        
    cursor.execute("DELETE FROM fact_checkers WHERE id = %s RETURNING id", (fact_checker_id,))
    deleted = cursor.fetchone()
    
    if not deleted:
        raise HTTPException(status_code=404, detail="Fact Checker not found")
        
    cursor.connection.commit()
    return SuccessResponse(data=None, message="Fact Checker deleted successfully")
