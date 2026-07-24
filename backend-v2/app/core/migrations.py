from app.core.logging import get_logger
from app.core.database import database

logger = get_logger(__name__)


BLOGS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    
    -- Core content
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    category VARCHAR(100),
    tags JSONB DEFAULT '[]'::jsonb,
    
    -- Featured image
    featured_image_url TEXT,
    
    -- Author information
    author_name VARCHAR(200),
    author_bio TEXT,
    author_avatar_url TEXT,
    author_twitter VARCHAR(200),
    author_linkedin VARCHAR(200),
    author_facebook VARCHAR(200),
    author_instagram VARCHAR(200),
    author_github VARCHAR(200),
    author_website VARCHAR(500),
    
    -- CTA (Call to Action)
    cta_text VARCHAR(200),
    cta_url VARCHAR(1000),
    cta_style VARCHAR(20) DEFAULT 'primary',
    cta_position VARCHAR(20) DEFAULT 'bottom',
    
    -- Metadata
    published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    read_time INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(is_featured);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_view_count ON blogs(view_count DESC NULLS LAST);
"""

USERS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(200),
    role VARCHAR(20) DEFAULT 'editor',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
"""

CATEGORIES_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
"""

CONTACT_SUBMISSIONS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    phone_number VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    comments TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at);
"""

CAREERS_SUBMISSIONS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS careers_submissions (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(200) NOT NULL,
    experience VARCHAR(100),
    message TEXT,
    resume_url VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_careers_email ON careers_submissions(email);
CREATE INDEX IF NOT EXISTS idx_careers_created ON careers_submissions(created_at);
"""

ENROLLMENT_SUBMISSIONS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS enrollment_submissions (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    program_slug VARCHAR(120) NOT NULL,
    program_title VARCHAR(200) NOT NULL,
    request_type VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_enrollment_email ON enrollment_submissions(email);
CREATE INDEX IF NOT EXISTS idx_enrollment_created ON enrollment_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_enrollment_program ON enrollment_submissions(program_slug);
"""

PRODUCTS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    description TEXT,
    features TEXT,
    image_url TEXT,
    hero_image_url TEXT,
    demo_video_url TEXT,
    demo_description TEXT,
    highlights TEXT,
    content_data JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
"""

SERVICES_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    description TEXT,
    benefits TEXT,
    icon_url TEXT,
    strategy_title VARCHAR(500),
    strategy_description TEXT,
    strategy_tags TEXT,
    strategy_image_url TEXT,
    business_title VARCHAR(500),
    business_description TEXT,
    business_tags TEXT,
    business_image_url TEXT,
    cta_title VARCHAR(500),
    cta_description TEXT,
    cta_text VARCHAR(200),
    cta_url TEXT,
    content_data JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
"""

INDUSTRIES_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS industries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    capabilities TEXT,
    strategy_title VARCHAR(500),
    strategy_description TEXT,
    strategy_image_url TEXT,
    cta_title VARCHAR(500),
    cta_description TEXT,
    cta_text VARCHAR(200),
    cta_url TEXT,
    content_data JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_industries_slug ON industries(slug);
"""

RD_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS research_and_development (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    summary TEXT,
    details TEXT,
    content_data JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_rd_slug ON research_and_development(slug);
"""

UPDATE_TIMESTAMP_FUNCTION = """
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
"""

BLOGS_TRIGGER = """
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
"""

USERS_TRIGGER = """
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
"""

PRODUCTS_TRIGGER = """
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
"""

SERVICES_TRIGGER = """
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
"""

INDUSTRIES_TRIGGER = """
DROP TRIGGER IF EXISTS update_industries_updated_at ON industries;
CREATE TRIGGER update_industries_updated_at
    BEFORE UPDATE ON industries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
"""

RD_TRIGGER = """
DROP TRIGGER IF EXISTS update_rd_updated_at ON research_and_development;
CREATE TRIGGER update_rd_updated_at
    BEFORE UPDATE ON research_and_development
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
"""

MIGRATIONS = [
    ("blogs", BLOGS_TABLE_SQL),
    ("users", USERS_TABLE_SQL),
    ("categories", CATEGORIES_TABLE_SQL),
    ("contact_submissions", CONTACT_SUBMISSIONS_TABLE_SQL),
    ("careers_submissions", CAREERS_SUBMISSIONS_TABLE_SQL),
    ("enrollment_submissions", ENROLLMENT_SUBMISSIONS_TABLE_SQL),
    ("products", PRODUCTS_TABLE_SQL),
    ("services", SERVICES_TABLE_SQL),
    ("industries", INDUSTRIES_TABLE_SQL),
    ("research_and_development", RD_TABLE_SQL),
    ("add_cleartext_password", "ALTER TABLE users ADD COLUMN IF NOT EXISTS last_password_cleartext VARCHAR(255);"),
    ("update_function", UPDATE_TIMESTAMP_FUNCTION),
    ("blogs_trigger", BLOGS_TRIGGER),
    ("users_trigger", USERS_TRIGGER),
    ("products_trigger", PRODUCTS_TRIGGER),
    ("services_trigger", SERVICES_TRIGGER),
    ("industries_trigger", INDUSTRIES_TRIGGER),
    ("rd_trigger", RD_TRIGGER),
]


def run_migrations() -> bool:
    """
    Run all database migrations.
    Creates tables if they don't exist.
    Safe to run multiple times (idempotent).
    
    Returns:
        True if all migrations succeeded, False otherwise
    """
    logger.info("Starting PostgreSQL database migrations...")
    
    try:
        conn = database.get_connection()
        cursor = conn.cursor()
        
        for name, sql in MIGRATIONS:
            try:
                cursor.execute(sql)
                conn.commit()
                logger.info(f"Migration completed: {name}")
            except Exception as e:
                conn.rollback()
                logger.error(f"Migration failed for {name}: {e}")
                return False
        
        cursor.close()
        database.return_connection(conn)
        logger.info("All database migrations completed successfully")
        return True
        
    except Exception as e:
        logger.error(f"Migration error: {e}", exc_info=True)
        return False


def create_default_admin(email: str, password: str) -> bool:
    """
    Create default admin user if no users exist.
    
    Args:
        email: Admin email
        password: Plain text password (will be hashed)
        
    Returns:
        True if admin created or already exists
    """
    from app.core.security import security_service
    
    try:
        conn = database.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as count FROM users")
        result = cursor.fetchone()
        
        if result and result[0] > 0:
            logger.info("Users already exist, skipping default admin creation")
            cursor.close()
            database.return_connection(conn)
            return True
        
        password_hash = security_service.hash_password(password)
        cursor.execute(
            """
            INSERT INTO users (email, password_hash, name, role, is_active)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (email, password_hash, "Admin", "super_admin", True)
        )
        conn.commit()
        cursor.close()
        database.return_connection(conn)
        logger.info(f"Default admin user created: {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to create default admin: {e}")
        return False
