from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import get_db
from app.middleware.auth import get_current_user
from app.schemas.responses import SuccessResponse
from psycopg2.extensions import cursor as PgCursor

router = APIRouter(prefix="/api/admin/authors", tags=["authors"])

class AuthorCreate(BaseModel):
    name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None

class AuthorResponse(AuthorCreate):
    id: int

@router.get("", response_model=SuccessResponse[List[AuthorResponse]])
def get_authors(cursor: PgCursor = Depends(get_db)):
    cursor.execute("SELECT * FROM authors ORDER BY name ASC")
    authors = cursor.fetchall()
    return SuccessResponse(data=authors)

@router.post("", response_model=SuccessResponse[AuthorResponse])
def create_author(
    author: AuthorCreate,
    current_user: dict = Depends(get_current_user),
    cursor: PgCursor = Depends(get_db)
):
    query = """
        INSERT INTO authors (name, bio, avatar_url, twitter, linkedin, facebook, instagram, github, website)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *
    """
    params = (
        author.name, author.bio, author.avatar_url, author.twitter, author.linkedin,
        author.facebook, author.instagram, author.github, author.website
    )
    cursor.execute(query, params)
    result = cursor.fetchone()
    cursor.connection.commit()
    return SuccessResponse(data=result, message="Author created successfully")

@router.put("/{author_id}", response_model=SuccessResponse[AuthorResponse])
def update_author(
    author_id: int,
    author: AuthorCreate,
    current_user: dict = Depends(get_current_user),
    cursor: PgCursor = Depends(get_db)
):
    query = """
        UPDATE authors
        SET name = %s, bio = %s, avatar_url = %s, twitter = %s, linkedin = %s,
            facebook = %s, instagram = %s, github = %s, website = %s, updated_at = CURRENT_TIMESTAMP
        WHERE id = %s RETURNING *
    """
    params = (
        author.name, author.bio, author.avatar_url, author.twitter, author.linkedin,
        author.facebook, author.instagram, author.github, author.website, author_id
    )
    cursor.execute(query, params)
    result = cursor.fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Author not found")
        
    cursor.connection.commit()
    return SuccessResponse(data=result, message="Author updated successfully")

@router.delete("/{author_id}", response_model=SuccessResponse)
def delete_author(
    author_id: int,
    current_user: dict = Depends(get_current_user),
    cursor: PgCursor = Depends(get_db)
):
    # Cascade delete: Remove from primary author_id
    cursor.execute("UPDATE blogs SET author_id = NULL, author_name = NULL WHERE author_id = %s", (author_id,))
    
    # Cascade delete: Remove from author_ids JSONB array
    query = """
        UPDATE blogs 
        SET author_ids = COALESCE((
            SELECT jsonb_agg(elem) 
            FROM jsonb_array_elements(author_ids) elem 
            WHERE elem::text != %s
        ), '[]'::jsonb)
        WHERE author_ids @> %s::jsonb
    """
    cursor.execute(query, (str(author_id), f"[{author_id}]"))
        
    cursor.execute("DELETE FROM authors WHERE id = %s RETURNING id", (author_id,))
    deleted = cursor.fetchone()
    
    if not deleted:
        raise HTTPException(status_code=404, detail="Author not found")
        
    cursor.connection.commit()
    return SuccessResponse(data=None, message="Author deleted successfully")
