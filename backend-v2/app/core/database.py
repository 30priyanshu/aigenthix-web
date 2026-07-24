from collections.abc import Generator
from urllib.parse import urlparse, parse_qs
from time import time
import psycopg2
from psycopg2 import pool, extras
from psycopg2.extensions import connection as PgConnection
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class Database:
    
    def __init__(self):
        self._pool: pool.ThreadedConnectionPool | None = None
        self._conn_timestamps: dict = {}
        self._max_conn_age = 1800
        self._init_pool()
    
    def _parse_database_url(self) -> dict:
        url = settings.DATABASE_URL
        
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        
        parsed = urlparse(url)
        
        if parsed.scheme not in ("postgresql", "postgres"):
            raise ValueError("DATABASE_URL must start with postgresql:// or postgres://")
        
        if not parsed.username:
            raise ValueError("DATABASE_URL must include credentials")
        
        dbname = parsed.path.lstrip("/")
        if not dbname:
            raise ValueError("DATABASE_URL must include database name")
        
        config = {
            "host": parsed.hostname,
            "port": parsed.port or 5432,
            "user": parsed.username,
            "password": parsed.password or "",
            "dbname": dbname,
        }
        
        query_params = parse_qs(parsed.query)
        
        sslmode = query_params.get("sslmode", [""])[0]
        if sslmode in ("require", "verify-ca", "verify-full"):
            config["sslmode"] = sslmode
        
        channel_binding = query_params.get("channel_binding", [""])[0]
        if channel_binding:
            config["channel_binding"] = channel_binding
        
        return config
    
    def _init_pool(self) -> None:
        try:
            db_config = self._parse_database_url()
            
            self._pool = pool.ThreadedConnectionPool(
                minconn=1,
                maxconn=5,
                **db_config
            )
            logger.info(
                "PostgreSQL connection pool initialized",
                extra={"host": db_config["host"], "port": db_config["port"], "dbname": db_config["dbname"]}
            )
        except (psycopg2.Error, ValueError) as e:
            logger.error(f"Failed to initialize database pool: {e}")
            self._pool = None
    
    def get_connection(self) -> PgConnection:
        if not self._pool:
            self._init_pool()
        if not self._pool:
            raise ConnectionError("Database connection pool not available")
        
        conn = self._pool.getconn()
        conn_id = id(conn)
        
        if conn_id in self._conn_timestamps:
            age = time() - self._conn_timestamps[conn_id]
            if age > self._max_conn_age:
                try:
                    self._pool.putconn(conn, close=True)
                    conn = self._pool.getconn()
                    conn_id = id(conn)
                except Exception as e:
                    logger.error(f"Connection recycling failed: {e}")
        
        self._conn_timestamps[conn_id] = time()
        
        max_retries = 3
        for _ in range(max_retries):
            try:
                cursor = conn.cursor()
                cursor.execute("SELECT 1")
                cursor.close()
                break
            except Exception as e:
                logger.warning(f"Connection validation failed, getting another: {e}")
                try:
                    self._pool.putconn(conn, close=True)
                except Exception:
                    pass
                try:
                    conn = self._pool.getconn()
                    self._conn_timestamps[id(conn)] = time()
                except Exception as ex:
                    logger.error(f"Failed to get new connection from pool: {ex}")
                    self._init_pool()
                    if self._pool:
                        conn = self._pool.getconn()
                        self._conn_timestamps[id(conn)] = time()
                    else:
                        raise
        
        try:
            cursor = conn.cursor()
            cursor.execute("SET statement_timeout = '30s'")
            cursor.close()
            conn.commit()
        except Exception as e:
            logger.warning(f"Failed to set statement_timeout: {e}")
        
        return conn
    
    def return_connection(self, conn: PgConnection) -> None:
        if self._pool and conn:
            self._pool.putconn(conn)
    
    def close_pool(self) -> None:
        if self._pool:
            self._pool.closeall()
            logger.info("Database connection pool closed")
    

    def health_check(self) -> bool:
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
            cursor.close()
            self.return_connection(conn)
            return True
        except (psycopg2.Error, ConnectionError) as e:
            logger.error(f"Database health check failed: {e}")
            return False


database = Database()


def get_db() -> Generator:
    conn = database.get_connection()
    cursor = conn.cursor(cursor_factory=extras.RealDictCursor)
    try:
        yield cursor
        conn.commit()
    except Exception as e:
        try:
            conn.rollback()
        except Exception as rb_e:
            logger.error(f"Rollback failed: {rb_e}")
        logger.error(f"Database transaction failed: {e}")
        raise
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        database.return_connection(conn)
