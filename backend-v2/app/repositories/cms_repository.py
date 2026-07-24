from typing import Optional, List
import json
from psycopg2.extras import Json
from app.core.logging import get_logger

logger = get_logger(__name__)

class CMSRepository:
    def __init__(self, cursor):
        self.cursor = cursor
        
    # --- Generic CRUD helpers ---
    def _create(self, table: str, fields: dict) -> dict:
        processed_fields = {k: (Json(v) if isinstance(v, (dict, list)) else v) for k, v in fields.items()}
        keys = list(processed_fields.keys())
        values = list(processed_fields.values())
        placeholders = ", ".join(["%s"] * len(keys))
        columns = ", ".join(keys)
        
        query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders}) RETURNING *"
        self.cursor.execute(query, tuple(values))
        result = self.cursor.fetchone()
        return dict(result) if result else {}
        
    def _get_by_id(self, table: str, entity_id: int) -> Optional[dict]:
        self.cursor.execute(f"SELECT * FROM {table} WHERE id = %s", (entity_id,))
        result = self.cursor.fetchone()
        return dict(result) if result else None
        
    def _get_all(self, table: str) -> List[dict]:
        self.cursor.execute(f"SELECT * FROM {table} ORDER BY created_at DESC")
        rows = self.cursor.fetchall()
        return [dict(row) for row in rows] if rows else []
        
    def _update(self, table: str, entity_id: int, fields: dict) -> Optional[dict]:
        if not fields:
            return self._get_by_id(table, entity_id)
            
        processed_fields = {k: (Json(v) if isinstance(v, (dict, list)) else v) for k, v in fields.items()}
        set_clauses = [f"{k} = %s" for k in processed_fields.keys()]
        values = list(processed_fields.values())
        values.append(entity_id)
        
        query = f"UPDATE {table} SET {', '.join(set_clauses)} WHERE id = %s RETURNING *"
        self.cursor.execute(query, tuple(values))
        result = self.cursor.fetchone()
        return dict(result) if result else None
        
    def _delete(self, table: str, entity_id: int) -> bool:
        self.cursor.execute(f"DELETE FROM {table} WHERE id = %s RETURNING id", (entity_id,))
        return bool(self.cursor.fetchone())

    # --- PRODUCTS ---
    def create_product(self, data: dict) -> dict: return self._create("products", data)
    def get_product(self, id: int) -> Optional[dict]: return self._get_by_id("products", id)
    def get_products(self) -> List[dict]: return self._get_all("products")
    def update_product(self, id: int, data: dict) -> Optional[dict]: return self._update("products", id, data)
    def delete_product(self, id: int) -> bool: return self._delete("products", id)

    # --- SERVICES ---
    def create_service(self, data: dict) -> dict: return self._create("services", data)
    def get_service(self, id: int) -> Optional[dict]: return self._get_by_id("services", id)
    def get_services(self) -> List[dict]: return self._get_all("services")
    def update_service(self, id: int, data: dict) -> Optional[dict]: return self._update("services", id, data)
    def delete_service(self, id: int) -> bool: return self._delete("services", id)

    # --- INDUSTRIES ---
    def create_industry(self, data: dict) -> dict: return self._create("industries", data)
    def get_industry(self, id: int) -> Optional[dict]: return self._get_by_id("industries", id)
    def get_industries(self) -> List[dict]: return self._get_all("industries")
    def update_industry(self, id: int, data: dict) -> Optional[dict]: return self._update("industries", id, data)
    def delete_industry(self, id: int) -> bool: return self._delete("industries", id)

    # --- R&D ---
    def create_rd(self, data: dict) -> dict: return self._create("research_and_development", data)
    def get_rd(self, id: int) -> Optional[dict]: return self._get_by_id("research_and_development", id)
    def get_rds(self) -> List[dict]: return self._get_all("research_and_development")
    def update_rd(self, id: int, data: dict) -> Optional[dict]: return self._update("research_and_development", id, data)
    def delete_rd(self, id: int) -> bool: return self._delete("research_and_development", id)
