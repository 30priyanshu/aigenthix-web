export const CMS_CONFIG = {
    API_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
    API_TIMEOUT_MS: 15000,
    STORAGE_KEYS: {
        TOKEN: 'cms_auth_token',
        USER: 'cms_auth_user'
    }
};
