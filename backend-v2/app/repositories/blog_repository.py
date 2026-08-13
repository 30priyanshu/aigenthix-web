
from typing import List, Optional
import json
from datetime import datetime

from app.core.logging import get_logger
from app.schemas.blog import BlogCreate, BlogUpdate

logger = get_logger(__name__)


class BlogRepository:
    def __init__(self, cursor):
        self.cursor = cursor
    
    def _parse_json_fields(self, blog: dict) -> dict:
        if not blog:
            return blog
        
        blog = dict(blog)
        
        if blog.get("tags") is None:
            blog["tags"] = []
        elif isinstance(blog["tags"], str):
            try:
                blog["tags"] = json.loads(blog["tags"])
            except json.JSONDecodeError:
                blog["tags"] = []
        
        if blog.get("author_ids") is None:
            blog["author_ids"] = []
        elif isinstance(blog["author_ids"], str):
            try:
                blog["author_ids"] = json.loads(blog["author_ids"])
            except json.JSONDecodeError:
                blog["author_ids"] = []
                
        if blog.get("fact_checker_ids") is None:
            blog["fact_checker_ids"] = []
        elif isinstance(blog["fact_checker_ids"], str):
            try:
                blog["fact_checker_ids"] = json.loads(blog["fact_checker_ids"])
            except json.JSONDecodeError:
                blog["fact_checker_ids"] = []
        
        if blog.get("status") is None:
            blog["status"] = "published" if blog.get("published") else "draft"
            
        blog = self._attach_authors_data(blog)
        return self._attach_fact_checkers_data(blog)
        
    def _attach_authors_data(self, blog: dict) -> dict:
        if not blog:
            return blog
            
        author_id = blog.get("author_id")
        author_ids = blog.get("author_ids")
        if not author_id and not (author_ids and isinstance(author_ids, list)):
            blog["authors_data"] = []
            return blog
            
        try:
            all_ids = set()
            if author_id:
                all_ids.add(author_id)
            if author_ids and isinstance(author_ids, list):
                all_ids.update(author_ids)
                
            placeholders = ','.join(['%s'] * len(all_ids))
            self.cursor.execute(
                f"SELECT * FROM authors WHERE id IN ({placeholders})", 
                tuple(all_ids)
            )
            authors = self.cursor.fetchall()
            authors_map = {a["id"]: dict(a) for a in authors}
            
            authors_data = []
            
            # Main author first
            if author_id and author_id in authors_map:
                main_author = dict(authors_map[author_id])
                main_author["role"] = "author"
                authors_data.append(main_author)
                
            # Then contributors
            if author_ids and isinstance(author_ids, list):
                for aid in author_ids:
                    if aid in authors_map and aid != author_id:
                        contributor = dict(authors_map[aid])
                        contributor["role"] = "contributor"
                        authors_data.append(contributor)
                    
            blog["authors_data"] = authors_data
        except Exception as e:
            logger.error(f"Error attaching authors data: {e}")
            blog["authors_data"] = []
            
        return blog

    def _attach_fact_checkers_data(self, blog: dict) -> dict:
        if not blog:
            return blog
            
        fact_checker_ids = blog.get("fact_checker_ids")
        if not fact_checker_ids or not isinstance(fact_checker_ids, list):
            blog["fact_checkers_data"] = []
            return blog
            
        try:
            placeholders = ','.join(['%s'] * len(fact_checker_ids))
            self.cursor.execute(
                f"SELECT * FROM fact_checkers WHERE id IN ({placeholders})", 
                tuple(fact_checker_ids)
            )
            fc_list = self.cursor.fetchall()
            fc_map = {a["id"]: dict(a) for a in fc_list}
            
            fc_data = []
            for fid in fact_checker_ids:
                if fid in fc_map:
                    fc_data.append(fc_map[fid])
                    
            blog["fact_checkers_data"] = fc_data
        except Exception as e:
            logger.error(f"Error attaching fact checkers data: {e}")
            blog["fact_checkers_data"] = []
            
        return blog
    
    def get_by_id(self, blog_id: int) -> Optional[dict]:
        self.cursor.execute(
            "SELECT * FROM blogs WHERE id = %s",
            (blog_id,)
        )
        blog = self.cursor.fetchone()
        return self._parse_json_fields(blog) if blog else None
    
    def get_by_slug(self, slug: str, include_drafts: bool = False) -> Optional[dict]:
        query = "SELECT * FROM blogs WHERE slug = %s"
        if not include_drafts:
            query += " AND published = TRUE"
        self.cursor.execute(query, (slug,))
        blog = self.cursor.fetchone()
        return self._parse_json_fields(blog) if blog else None
    
    def get_all(
        self,
        published_only: bool = False,
        limit: Optional[int] = None
    ) -> List[dict]:
        query = "SELECT * FROM blogs"
        params = []
        
        if published_only:
            query += " WHERE published = TRUE"
        
        query += " ORDER BY created_at DESC"
        
        if limit:
            query += " LIMIT %s"
            params.append(limit)
        
        self.cursor.execute(query, tuple(params) if params else None)
        blogs = self.cursor.fetchall()
        
        return [self._parse_json_fields(blog) for blog in blogs]
    
    def get_featured(self) -> Optional[dict]:
        self.cursor.execute(
            """
            SELECT id, title, slug, excerpt, featured_image_url,
                   author_id, author_name, created_at, updated_at, tags, category, read_time,
                   published, is_featured, status, ad_category, author_ids, fact_checker_ids
            FROM blogs
            WHERE published = TRUE AND is_featured = TRUE
            ORDER BY created_at DESC
            LIMIT 1
            """
        )
        blog = self.cursor.fetchone()
        return self._parse_json_fields(blog) if blog else None

    def get_popular(self, limit: int = 6) -> List[dict]:
        self.cursor.execute(
            """
            SELECT id, title, slug, excerpt, featured_image_url,
                   author_id, author_name, created_at, updated_at, tags, category, read_time,
                   published, is_featured, status, ad_category, author_ids, fact_checker_ids
            FROM blogs
            WHERE published = TRUE
            ORDER BY view_count DESC, created_at DESC
            LIMIT %s
            """,
            (limit,)
        )
        return [self._parse_json_fields(blog) for blog in self.cursor.fetchall()]

    def increment_views(self, slug: str) -> bool:
        self.cursor.execute(
            "UPDATE blogs SET view_count = view_count + 1 WHERE slug = %s",
            (slug,)
        )
        return self.cursor.rowcount > 0
    
    def create(self, blog_data: BlogCreate) -> int:
        word_count = len(blog_data.content.split())
        read_time = max(1, round(word_count / 200))
        
        tags_json = json.dumps(blog_data.tags)
        author_ids_json = json.dumps(blog_data.author_ids) if hasattr(blog_data, 'author_ids') and blog_data.author_ids else "[]"
        fact_checker_ids_json = json.dumps(blog_data.fact_checker_ids) if hasattr(blog_data, 'fact_checker_ids') and blog_data.fact_checker_ids else "[]"
        
        query = """
            INSERT INTO blogs (
                title, content, excerpt, slug, category, tags,
                featured_image_url, featured_image_alt, schema_type, canonical_url, show_toc,
                author_id, author_name, author_title, author_bio, author_avatar_url,
                author_twitter, author_linkedin, author_facebook,
                author_instagram, author_github, author_website,
                fact_checker_name, fact_checker_bio, fact_checker_avatar_url, fact_checker_ids,
                faqs,
                meta_title, meta_description, meta_keywords,
                cta_text, cta_url, cta_style, cta_position,
                published, is_featured, read_time, status, author_ids, ad_category
            ) VALUES (
                %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            RETURNING id
        """
        
        faqs_json = json.dumps(blog_data.faqs) if blog_data.faqs else "[]"
        
        params = (
            blog_data.title, blog_data.content, blog_data.excerpt,
            blog_data.slug, blog_data.category, tags_json,
            blog_data.featured_image_url, blog_data.featured_image_alt, blog_data.schema_type,
            blog_data.canonical_url, blog_data.show_toc,
            blog_data.author_id, blog_data.author_name,
            blog_data.author_title, blog_data.author_bio, blog_data.author_avatar_url,
            blog_data.author_twitter, blog_data.author_linkedin,
            blog_data.author_facebook, blog_data.author_instagram,
            blog_data.author_github, blog_data.author_website,
            blog_data.fact_checker_name, blog_data.fact_checker_bio, blog_data.fact_checker_avatar_url, fact_checker_ids_json,
            faqs_json,
            blog_data.meta_title, blog_data.meta_description, blog_data.meta_keywords,
            blog_data.cta_text, blog_data.cta_url,
            blog_data.cta_style, blog_data.cta_position,
            blog_data.published, blog_data.is_featured, read_time, blog_data.status, author_ids_json, blog_data.ad_category
        )
        
        self.cursor.execute(query, params)
        result = self.cursor.fetchone()
        return result["id"] if result else 0
    
    def update(self, blog_id: int, blog_data: BlogUpdate) -> bool:
        word_count = len(blog_data.content.split())
        read_time = max(1, round(word_count / 200))
        
        tags_json = json.dumps(blog_data.tags)
        faqs_json = json.dumps(blog_data.faqs) if blog_data.faqs else "[]"
        author_ids_json = json.dumps(blog_data.author_ids) if hasattr(blog_data, 'author_ids') and blog_data.author_ids else "[]"
        fact_checker_ids_json = json.dumps(blog_data.fact_checker_ids) if hasattr(blog_data, 'fact_checker_ids') and blog_data.fact_checker_ids else "[]"
        
        query = """
            UPDATE blogs SET
                title = %s, content = %s, excerpt = %s, slug = %s,
                category = %s, tags = %s, featured_image_url = %s,
                featured_image_alt = %s, schema_type = %s, canonical_url = %s, show_toc = %s,
                author_id = %s, author_name = %s, author_title = %s, author_bio = %s, author_avatar_url = %s,
                author_twitter = %s, author_linkedin = %s,
                author_facebook = %s, author_instagram = %s,
                author_github = %s, author_website = %s,
                fact_checker_name = %s, fact_checker_bio = %s, fact_checker_avatar_url = %s, fact_checker_ids = %s,
                faqs = %s,
                meta_title = %s, meta_description = %s, meta_keywords = %s,
                cta_text = %s, cta_url = %s, cta_style = %s,
                cta_position = %s, published = %s, is_featured = %s,
                read_time = %s, status = %s, author_ids = %s, ad_category = %s
            WHERE id = %s
        """
        
        params = (
            blog_data.title, blog_data.content, blog_data.excerpt,
            blog_data.slug, blog_data.category, tags_json,
            blog_data.featured_image_url, blog_data.featured_image_alt, blog_data.schema_type,
            blog_data.canonical_url, blog_data.show_toc,
            blog_data.author_id, blog_data.author_name,
            blog_data.author_title, blog_data.author_bio, blog_data.author_avatar_url,
            blog_data.author_twitter, blog_data.author_linkedin,
            blog_data.author_facebook, blog_data.author_instagram,
            blog_data.author_github, blog_data.author_website,
            blog_data.fact_checker_name, blog_data.fact_checker_bio, blog_data.fact_checker_avatar_url, fact_checker_ids_json,
            faqs_json,
            blog_data.meta_title, blog_data.meta_description, blog_data.meta_keywords,
            blog_data.cta_text, blog_data.cta_url,
            blog_data.cta_style, blog_data.cta_position,
            blog_data.published, blog_data.is_featured, read_time, blog_data.status, author_ids_json, blog_data.ad_category, blog_id
        )
        
        self.cursor.execute(query, params)
        return self.cursor.rowcount > 0
    
    def delete(self, blog_id: int) -> bool:
        self.cursor.execute("DELETE FROM blogs WHERE id = %s", (blog_id,))
        return self.cursor.rowcount > 0
    
    def toggle_published(self, blog_id: int) -> Optional[bool]:
        self.cursor.execute(
            "SELECT published FROM blogs WHERE id = %s",
            (blog_id,)
        )
        result = self.cursor.fetchone()
        if not result:
            return None
        
        new_status = not result["published"]
        new_status_str = "published" if new_status else "draft"
        self.cursor.execute(
            "UPDATE blogs SET published = %s, status = %s WHERE id = %s",
            (new_status, new_status_str, blog_id)
        )
        return new_status
    
    def toggle_featured(self, blog_id: int) -> Optional[bool]:
        self.cursor.execute(
            "SELECT is_featured FROM blogs WHERE id = %s",
            (blog_id,)
        )
        result = self.cursor.fetchone()
        if not result:
            return None
        
        new_status = not result["is_featured"]
        self.cursor.execute(
            "UPDATE blogs SET is_featured = %s WHERE id = %s",
            (new_status, blog_id)
        )
        return new_status
    
    def bulk_update_published(self, blog_ids: List[int], published: bool) -> int:
        if not blog_ids:
            return 0
        
        placeholders = ','.join(['%s'] * len(blog_ids))
        status_str = "published" if published else "draft"
        query = f"UPDATE blogs SET published = %s, status = %s WHERE id IN ({placeholders})"
        params = (published, status_str, *blog_ids)
        
        self.cursor.execute(query, params)
        return self.cursor.rowcount
    
    def bulk_delete(self, blog_ids: List[int]) -> int:
        if not blog_ids:
            return 0
        
        placeholders = ','.join(['%s'] * len(blog_ids))
        query = f"DELETE FROM blogs WHERE id IN ({placeholders})"
        
        self.cursor.execute(query, tuple(blog_ids))
        return self.cursor.rowcount
