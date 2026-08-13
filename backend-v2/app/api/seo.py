from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import get_db
from app.middleware.auth import get_current_user
from app.schemas.responses import SuccessResponse
from psycopg2.extensions import cursor as PgCursor
import os
import requests

router = APIRouter(tags=["seo"])

@router.get("/api/seo/robots.txt", response_class=Response)
def get_robots_txt(cursor: PgCursor = Depends(get_db)):
    cursor.execute("SELECT value FROM settings WHERE key = 'robots.txt'")
    result = cursor.fetchone()
    content = result["value"] if result else "User-agent: *\nAllow: /"
    return Response(content=content, media_type="text/plain")

class SettingsUpdate(BaseModel):
    value: str

@router.post("/api/admin/seo/robots.txt", response_model=SuccessResponse[dict])
def update_robots_txt(
    data: SettingsUpdate,
    current_user: dict = Depends(get_current_user),
    cursor: PgCursor = Depends(get_db)
):
    cursor.execute(
        "INSERT INTO settings (key, value) VALUES ('robots.txt', %s) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        (data.value,)
    )
    cursor.connection.commit()
    return SuccessResponse(message="robots.txt updated successfully")

@router.get("/api/redirects/check", response_model=SuccessResponse[Optional[str]])
def check_redirect(path: str, cursor: PgCursor = Depends(get_db)):
    # Remove leading slash if any
    clean_path = path.lstrip('/')
    cursor.execute("SELECT new_slug FROM redirects WHERE old_slug = %s", (clean_path,))
    result = cursor.fetchone()
    if result:
        return SuccessResponse(data=result["new_slug"])
    return SuccessResponse(data=None)

@router.get("/api/sitemap.xml", response_class=Response)
def get_sitemap(cursor: PgCursor = Depends(get_db)):
    cursor.execute("SELECT slug, updated_at FROM blogs WHERE published = TRUE")
    blogs = cursor.fetchall()
    
    xml = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # Base URL should ideally be from settings, using hardcoded for now
    base_url = "https://aigenthix.com"
    
    for blog in blogs:
        xml.append('  <url>')
        xml.append(f'    <loc>{base_url}/blog/{blog["slug"]}</loc>')
        xml.append(f'    <lastmod>{blog["updated_at"].strftime("%Y-%m-%d")}</lastmod>')
        xml.append('  </url>')
        
    xml.append('</urlset>')
    
    return Response(content="\n".join(xml), media_type="application/xml")

@router.get("/api/feed", response_class=Response)
def get_rss_feed(cursor: PgCursor = Depends(get_db)):
    cursor.execute("SELECT title, slug, excerpt, updated_at FROM blogs WHERE published = TRUE ORDER BY created_at DESC LIMIT 20")
    blogs = cursor.fetchall()
    
    base_url = "https://aigenthix.com"
    
    xml = ['<?xml version="1.0" encoding="UTF-8" ?>']
    xml.append('<rss version="2.0">')
    xml.append('<channel>')
    xml.append('  <title>Aigenthix Blog</title>')
    xml.append(f'  <link>{base_url}/blog</link>')
    xml.append('  <description>Latest from Aigenthix</description>')
    
    for blog in blogs:
        xml.append('  <item>')
        xml.append(f'    <title>{blog["title"]}</title>')
        xml.append(f'    <link>{base_url}/blog/{blog["slug"]}</link>')
        xml.append(f'    <description>{blog["excerpt"]}</description>')
        xml.append(f'    <pubDate>{blog["updated_at"].strftime("%a, %d %b %Y %H:%M:%S +0000")}</pubDate>')
        xml.append('  </item>')
        
    xml.append('</channel>')
    xml.append('</rss>')
    
    return Response(content="\n".join(xml), media_type="application/xml")

@router.post("/api/admin/purge-cache", response_model=SuccessResponse[dict])
def purge_cache(current_user: dict = Depends(get_current_user)):
    # Dummy implementation for cache purging
    # In a real scenario, this would call Cloudflare or Vercel API
    return SuccessResponse(message="Cache purge triggered successfully")
