import { CMS_CONFIG } from './config';

export const Auth = {
    login: async (email, password) => {
        try {
            const response = await fetch(`${CMS_CONFIG.API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Login failed');
            }

            if (data.token) {
                Auth.setToken(data.token);
                Auth.setUser(data.user);
                return true;
            }
            throw new Error('No token received');
        } catch (error) {
            console.error('[Login] Error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem(CMS_CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CMS_CONFIG.STORAGE_KEYS.USER);
    },

    getToken: () => {
        return localStorage.getItem(CMS_CONFIG.STORAGE_KEYS.TOKEN);
    },

    setToken: (token) => {
        localStorage.setItem(CMS_CONFIG.STORAGE_KEYS.TOKEN, token);
    },

    getUser: () => {
        const userStr = localStorage.getItem(CMS_CONFIG.STORAGE_KEYS.USER);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    setUser: (user) => {
        localStorage.setItem(CMS_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    },

    isAuthenticated: () => {
        const token = Auth.getToken();
        return !!token;
    }
};
