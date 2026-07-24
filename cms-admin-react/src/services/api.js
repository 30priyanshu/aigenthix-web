import { CMS_CONFIG } from './config';
import { Auth } from './auth';

class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

const fetchWithTimeout = async (resource, options = {}) => {
    const { timeout = CMS_CONFIG.API_TIMEOUT_MS } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
};

const request = async (endpoint, options = {}, requireAuth = false) => {
    const url = `${CMS_CONFIG.API_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
    };

    if (requireAuth) {
        const token = Auth.getToken();
        if (!token) {
            Auth.logout();
            window.location.href = '/login';
            throw new Error('Authentication required');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetchWithTimeout(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            Auth.logout();
            window.location.href = '/login';
            throw new ApiError('Session expired', 401);
        }

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            let errorMessage = data?.detail || data?.message || response.statusText || 'API Request Failed';
            if (Array.isArray(errorMessage)) {
                errorMessage = errorMessage.map(e => `${e.loc?.slice(-1)}: ${e.msg}`).join(', ');
            }
            throw new ApiError(errorMessage, response.status, data);
        }

        // Handle standardized { success, data, message } wrapper if present
        if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
            if (!data.success) {
                throw new ApiError(data.message || 'Operation failed', response.status, data);
            }
            return data.data;
        }

        return data;

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new ApiError('Request timed out. Please check your connection and try again.', 408);
        }
        if (error instanceof ApiError) {
            throw error;
        }
        console.error('[API Error]:', error);
        throw new ApiError(error.message || 'Network error occurred', 0);
    }
};

export const Api = {
    get: (endpoint, requireAuth = false) => 
        request(endpoint, { method: 'GET' }, requireAuth),

    post: (endpoint, data, requireAuth = false) => 
        request(endpoint, { 
            method: 'POST', 
            body: JSON.stringify(data) 
        }, requireAuth),

    put: (endpoint, data, requireAuth = false) => 
        request(endpoint, { 
            method: 'PUT', 
            body: JSON.stringify(data) 
        }, requireAuth),

    patch: (endpoint, data, requireAuth = false) => 
        request(endpoint, { 
            method: 'PATCH', 
            body: JSON.stringify(data) 
        }, requireAuth),

    delete: (endpoint, requireAuth = false) => 
        request(endpoint, { method: 'DELETE' }, requireAuth),
};

const createGenericApi = (basePath) => ({
    getAll: () => Api.get(basePath, true),
    getById: (id) => Api.get(`${basePath}/${id}`, true),
    create: (data) => Api.post(basePath, data, true),
    update: (id, data) => Api.put(`${basePath}/${id}`, data, true),
    delete: (id) => Api.delete(`${basePath}/${id}`, true),
});

export const BlogsApi = {
    ...createGenericApi('/api/admin/blogs'),
    toggleStatus: (id, isPublished) => Api.patch(`/api/admin/blogs/${id}/publish`, { is_published: isPublished }, true),
    toggleFeatured: (id, isFeatured) => Api.patch(`/api/admin/blogs/${id}/featured`, { is_featured: isFeatured }, true),
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const token = Auth.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${CMS_CONFIG.API_URL}/api/admin/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Image upload failed');
        }

        const data = await response.json();
        return data.url;
    }
};

export const ProductsApi = createGenericApi('/cms/products');
export const ServicesApi = createGenericApi('/cms/services');
export const IndustriesApi = createGenericApi('/cms/industries');
export const RDApi = createGenericApi('/cms/rd');
export const UsersApi = {
    ...createGenericApi('/api/admin/users'),
    sendAccess: (data) => Api.post('/api/admin/users/send-access', data, true)
};

export const AuthApi = {
    changePassword: (data) => Api.post('/api/auth/change-password', data, true)
};
