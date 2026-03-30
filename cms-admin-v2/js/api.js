/**
 * API Client Module
 * Handles all HTTP requests to the backend with centralized error handling.
 * Depends on: config.js
 */

/**
 * Custom error class for API failures.
 */
class ApiError extends Error {
    constructor(message, status, endpoint) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.endpoint = endpoint;
    }
}

const Api = {
    /**
     * Makes an authenticated API request.
     * @param {string} endpoint - API endpoint (e.g., '/api/admin/blogs').
     * @param {Object} options - Fetch options.
     * @returns {Promise<any>} - Response data.
     */
    async request(endpoint, options = {}) {
        const { requiresAuth = false, body, method = 'GET', ...restOptions } = options;

        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        // Add auth token if required
        if (requiresAuth) {
            const token = Auth.getToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            CMS_CONFIG.API_TIMEOUT_MS
        );

        try {
            const response = await fetch(`${CMS_CONFIG.API_URL}${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
                ...restOptions
            });

            // Handle 401 Unauthorized - token expired or invalid
            if (response.status === 401 && requiresAuth) {
                // Clear auth and redirect to login
                Auth.clearAuth();
                window.location.href = CMS_CONFIG.ROUTES.LOGIN;
                throw new ApiError('Session expired. Please login again.', 401, endpoint);
            }

            const text = await response.text();
            let data = null;

            if (text) {
                try {
                    data = JSON.parse(text);
                } catch {
                    throw new ApiError('Invalid server response', response.status, endpoint);
                }
            }

            if (!response.ok) {
                // Don't expose internal error details in production
                const isClientError = response.status >= 400 && response.status < 500;
                const message = isClientError 
                    ? (data?.error || data?.detail || `Request failed (${response.status})`)
                    : 'An error occurred. Please try again later.';
                throw new ApiError(message, response.status, endpoint);
            }

            // Handle both envelope format {success, data} and direct data
            if (data && typeof data === 'object' && 'success' in data) {
                if (data.success === false) {
                    throw new ApiError(data.error || 'API error', response.status, endpoint);
                }
                return data.data;
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new ApiError('Request timed out. Please try again.', null, endpoint);
            }
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error. Please check your connection.', null, endpoint);
        } finally {
            clearTimeout(timeoutId);
        }
    },

    /**
     * GET request.
     */
    get(endpoint, requiresAuth = false) {
        return this.request(endpoint, { method: 'GET', requiresAuth });
    },

    /**
     * POST request.
     */
    post(endpoint, body, requiresAuth = false) {
        return this.request(endpoint, { method: 'POST', body, requiresAuth });
    },

    /**
     * PUT request.
     */
    put(endpoint, body, requiresAuth = false) {
        return this.request(endpoint, { method: 'PUT', body, requiresAuth });
    },

    /**
     * PATCH request.
     */
    patch(endpoint, body, requiresAuth = false) {
        return this.request(endpoint, { method: 'PATCH', body, requiresAuth });
    },

    /**
     * DELETE request.
     */
    delete(endpoint, requiresAuth = false) {
        return this.request(endpoint, { method: 'DELETE', requiresAuth });
    },

    /**
     * Validates file before upload.
     * @param {File} file - File to validate.
     * @param {Object} options - Validation options.
     * @returns {Object} - { valid: boolean, error?: string }
     */
    validateFile(file, options = {}) {
        const {
            maxSizeMB = 10,
            allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        } = options;

        if (!file || !(file instanceof File)) {
            return { valid: false, error: 'Invalid file' };
        }

        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
        }

        // Check file type
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            return { valid: false, error: 'File type not allowed' };
        }

        // Check file extension
        const fileName = file.name.toLowerCase();
        const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
        if (allowedExtensions.length > 0 && !hasValidExtension) {
            return { valid: false, error: 'File extension not allowed' };
        }

        return { valid: true };
    },

    /**
     * Upload file (multipart/form-data) with validation.
     * @param {string} endpoint - Upload endpoint.
     * @param {File} file - File to upload.
     * @param {Object} options - Upload options including validation.
     * @param {boolean} requiresAuth - Whether authentication is required.
     * @returns {Promise<any>} - Upload response data.
     */
    async upload(endpoint, file, requiresAuth = true, options = {}) {
        // Validate file before upload
        const validation = this.validateFile(file, options);
        if (!validation.valid) {
            throw new ApiError(validation.error, 400, endpoint);
        }

        const formData = new FormData();
        formData.append('file', file);

        const headers = new Headers();
        if (requiresAuth) {
            const token = Auth.getToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CMS_CONFIG.API_TIMEOUT_MS);

        try {
            const response = await fetch(`${CMS_CONFIG.API_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
                signal: controller.signal
            });

            // Handle 401 Unauthorized
            if (response.status === 401 && requiresAuth) {
                Auth.clearAuth();
                window.location.href = CMS_CONFIG.ROUTES.LOGIN;
                throw new ApiError('Session expired. Please login again.', 401, endpoint);
            }

            const text = await response.text();
            let data = null;

            if (text) {
                try {
                    data = JSON.parse(text);
                } catch {
                    throw new ApiError('Invalid server response', response.status, endpoint);
                }
            }

            if (!response.ok) {
                const isClientError = response.status >= 400 && response.status < 500;
                const message = isClientError
                    ? (data?.error || 'Upload failed')
                    : 'An error occurred during upload. Please try again later.';
                throw new ApiError(message, response.status, endpoint);
            }

            if (data && 'data' in data) {
                return data.data;
            }
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new ApiError('Upload timed out. Please try again.', null, endpoint);
            }
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error during upload.', null, endpoint);
        } finally {
            clearTimeout(timeoutId);
        }
    }
};

/**
 * Blogs API namespace.
 * Single source of truth for admin blog endpoints.
 * 
 * Entity Shape (Blog):
 * @typedef {Object} Blog
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {string} [excerpt]
 * @property {string} content
 * @property {string} [category]
 * @property {string[]} [tags]
 * @property {string} [featured_image_url]
 * @property {boolean} published
 * @property {boolean} is_featured
 * @property {string} created_at - ISO 8601 date string
 * @property {number} [read_time]
 * @property {string} [author_name]
 * @property {string} [author_avatar_url]
 * @property {string} [author_bio]
 */
const BlogsApi = {
    /** @returns {Promise<Blog[]>} */
    getAll: () => Api.get('/api/admin/blogs', true),
    
    /** @param {number} id @returns {Promise<Blog>} */
    getById: (id) => Api.get(`/api/admin/blogs/${id}`, true),
    
    /** @param {Object} data @returns {Promise<Blog>} */
    create: (data) => Api.post('/api/admin/blogs', data, true),
    
    /** @param {number} id @param {Object} data @returns {Promise<Blog>} */
    update: (id, data) => Api.put(`/api/admin/blogs/${id}`, data, true),
    
    /** @param {number} id @returns {Promise<void>} */
    delete: (id) => Api.delete(`/api/admin/blogs/${id}`, true),
    
    /** @param {number} id @returns {Promise<Blog>} */
    togglePublish: (id) => Api.patch(`/api/admin/blogs/${id}/publish`, undefined, true),
    
    /** @param {number} id @returns {Promise<Blog>} */
    toggleFeatured: (id) => Api.patch(`/api/admin/blogs/${id}/featured`, undefined, true),
    
    /** @param {number[]} ids @returns {Promise<void>} */
    bulkPublish: (ids) => Api.post('/api/admin/blogs/bulk/publish', { ids }, true),
    
    /** @param {number[]} ids @returns {Promise<void>} */
    bulkUnpublish: (ids) => Api.post('/api/admin/blogs/bulk/unpublish', { ids }, true),
    
    /** @param {number[]} ids @returns {Promise<void>} */
    bulkDelete: (ids) => Api.post('/api/admin/blogs/bulk/delete', { ids }, true),
    
    /** @param {File} file @returns {Promise<{url: string}>} */
    uploadImage: (file) => Api.upload('/api/admin/upload/image', file, true, {
        maxSizeMB: 10,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    })
};

// Freeze to prevent mutation
Object.freeze(Api);
Object.freeze(BlogsApi);
