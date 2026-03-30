CACHE_VERSION = "v1"


def make_cache_key(pattern: str, **kwargs) -> str:
    sanitized = {}
    for k, v in kwargs.items():
        clean_v = str(v).replace(":", "_").replace("*", "_").replace("{", "_").replace("}", "_")
        sanitized[k] = clean_v
    return f"{CACHE_VERSION}:{pattern}".format(**sanitized)
