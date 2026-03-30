/**
 * Authentication Module
 * Handles login, logout, and auth state persistence.
 * Depends on: config.js
 */

const Auth = {
    /**
     * Gets the stored auth token.
     * @returns {string|null} Token or null if not found/empty.
     */
    getToken() {
        const token = localStorage.getItem(CMS_CONFIG.STORAGE_KEYS.TOKEN);
        return (token && typeof token === 'string' && token.trim().length > 0) ? token : null;
    },

    /**
     * Gets the stored user data.
     * @returns {Object|null}
     */
    getUser() {
        const userStr = localStorage.getItem(CMS_CONFIG.STORAGE_KEYS.USER);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    /**
     * Checks if user is authenticated.
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Saves auth data to localStorage.
     * @param {string} token - JWT token.
     * @param {Object} user - User data.
     */
    saveAuth(token, user) {
        localStorage.setItem(CMS_CONFIG.STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(CMS_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    },

    /**
     * Clears auth data from localStorage.
     */
    clearAuth() {
        localStorage.removeItem(CMS_CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CMS_CONFIG.STORAGE_KEYS.USER);
    },

    /**
     * Logs in with email and password.
     * @param {string} email - User email.
     * @param {string} password - User password.
     * @returns {Promise<Object>} - Login response with token and user.
     */
    async login(email, password) {
        const response = await fetch(`${CMS_CONFIG.API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const text = await response.text();
        let json = null;

        if (text) {
            try {
                json = JSON.parse(text);
            } catch {
                throw new Error('Invalid login response from server');
            }
        }

        if (!response.ok) {
            const message = json?.detail || json?.error || 'Login failed';
            throw new Error(message);
        }

        // Validate response shape
        // Expected: { token: string (non-empty), user: Object }
        if (!json || typeof json.token !== 'string' || !json.token.trim() || !json.user) {
            throw new Error('Unexpected login response from server');
        }

        // Save auth data
        this.saveAuth(json.token, json.user);

        return json;
    },

    /**
     * Logs out the current user.
     */
    logout() {
        this.clearAuth();
        window.location.href = CMS_CONFIG.ROUTES.LOGIN;
    },

    /**
     * Requires authentication - redirects to login if not authenticated.
     * Call this at the top of protected pages.
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = CMS_CONFIG.ROUTES.LOGIN;
            return false;
        }
        return true;
    },

    /**
     * Redirects to dashboard if already authenticated.
     * Call this on login page.
     */
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = CMS_CONFIG.ROUTES.DASHBOARD;
            return true;
        }
        return false;
    }
};

// Freeze to prevent mutation
Object.freeze(Auth);
