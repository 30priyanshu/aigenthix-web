/**
 * Configuration Module
 * Centralizes environment-derived values for the CMS admin.
 */

const CMS_CONFIG = {
    /**
     * Base API URL for all backend requests.
     * In production, this is set via window.CMS_API_URL (injected at runtime).
     * Falls back to localhost for development.
     */
    API_URL: window.CMS_API_URL || 'http://18.61.102.27:8000',

    /**
     * Default network timeout in milliseconds.
     * Prevents indefinite hanging on slow connections.
     */
    API_TIMEOUT_MS: 15000,

    /**
     * Local storage keys for auth persistence.
     */
    STORAGE_KEYS: {
        TOKEN: 'cms_auth_token',
        USER: 'cms_auth_user'
    },

    /**
     * Routes within the CMS admin.
     */
    ROUTES: {
        LOGIN: 'login.html',
        DASHBOARD: 'dashboard.html',
        BLOG_NEW: 'blog-new.html',
        BLOG_EDIT: 'blog-edit.html'
    }
};

// Freeze to prevent accidental mutation
Object.freeze(CMS_CONFIG);
Object.freeze(CMS_CONFIG.STORAGE_KEYS);
Object.freeze(CMS_CONFIG.ROUTES);
