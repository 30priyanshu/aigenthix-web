import requests

data = {
    "title": "Test Title",
    "slug": "test-title",
    "content": "Test content",
    "author_name": "Author",
    "category": "Tech",
    "tags": "AI, ML",
    "published": True
}

# The backend port is 8000. Wait, admin API needs authentication?
# Yes, /api/admin/blogs needs auth!
# Let's just run it through fastapi TestClient locally.

from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.getcwd())
from app.main import app

client = TestClient(app)
# Actually, admin endpoints need JWT token.
# But we can just use the Pydantic schema directly!
from app.schemas.blog import BlogCreate

try:
    blog = BlogCreate(**data)
    print("Success!", blog.model_dump())
except Exception as e:
    print("ValidationError:")
    print(e)
