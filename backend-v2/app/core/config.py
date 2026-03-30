from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator, model_validator


class Settings(BaseSettings):
    APP_NAME: str = "AiGENThix CMS API"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False
    
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    JWT_ISSUER: str = "aigenthix-cms-api"
    
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    ALLOWED_HOSTS: str = "*"
    
    DATABASE_URL: str
    
    REDIS_URL: str | None = None
    CACHE_TTL: int = 300
    
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60
    AUTH_RATE_LIMIT_PER_MINUTE: int = 5
    CONTACT_RATE_LIMIT_PER_MINUTE: int = 3
    
    # Gemini API key for chatbot (optional)
    GEMINI_API_KEY: str | None = None
    
    ADMIN_EMAIL: str | None = None
    ADMIN_PASSWORD: str | None = None
    
    RESEND_API_KEY: str | None = None
    CONTACT_NOTIFICATION_EMAIL: str | None = None
    CONTACT_FROM_EMAIL: str | None = None
    
    _cors_origins_list: List[str] = []
    _allowed_hosts_list: List[str] = []
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )
    
    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters")
        return v
    
    @model_validator(mode="after")
    def parse_lists(self) -> "Settings":
        if self.CORS_ORIGINS:
            self._cors_origins_list = [
                origin.strip() 
                for origin in self.CORS_ORIGINS.split(",") 
                if origin.strip()
            ]
        if self.ALLOWED_HOSTS:
            self._allowed_hosts_list = [
                host.strip()
                for host in self.ALLOWED_HOSTS.split(",")
                if host.strip()
            ]
        return self
    
    @property
    def cors_origins(self) -> List[str]:
        return self._cors_origins_list
    
    @property
    def allowed_hosts(self) -> List[str]:
        return self._allowed_hosts_list


settings = Settings()
