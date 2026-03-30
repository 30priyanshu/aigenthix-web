import json
from typing import Any, Optional
import redis
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class CacheService:
    def __init__(self):
        self._client: Optional[redis.Redis] = None
        self._available = False
        self._init_redis()
    
    def _init_redis(self) -> None:
        if not settings.REDIS_URL:
            logger.warning("REDIS_URL not configured - caching disabled")
            return
        
        try:
            self._client = redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_connect_timeout=2
            )
            self._client.ping()
            self._available = True
            logger.info("Redis cache initialized")
        except Exception as e:
            logger.warning(f"Redis unavailable: {e} - running without cache")
            self._client = None
            self._available = False
    
    def get(self, key: str) -> Optional[Any]:
        if not self._available or not self._client:
            return None
        
        try:
            data = self._client.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {e}")
            return None
    
    def set(
        self,
        key: str,
        value: Any,
        ttl: int = settings.CACHE_TTL
    ) -> bool:
        if not self._available or not self._client:
            return False
        
        try:
            self._client.setex(
                key,
                ttl,
                json.dumps(value)
            )
            return True
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {e}")
            return False
    
    def delete_pattern(self, pattern: str) -> bool:
        if not self._available or not self._client:
            return False
        try:
            cursor = 0
            while True:
                cursor, keys = self._client.scan(cursor, match=pattern, count=100)
                if keys:
                    self._client.delete(*keys)
                if cursor == 0:
                    break
            return True
        except Exception as e:
            logger.error(f"Cache delete error for pattern {pattern}: {e}")
            return False

    def invalidate_blog_cache(self) -> None:
        self.delete_pattern("v1:blog:*")


cache_service = CacheService()
