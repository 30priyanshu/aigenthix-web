/**
 * Utility Functions
 * Reusable helper functions for the CMS admin.
 */

const Utils = {
    /**
     * Escapes HTML to prevent XSS attacks.
     * @param {string} str - The string to escape.
     * @returns {string} - The escaped string.
     */
    escapeHtml(str) {
        if (!str || typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Validates URL to prevent javascript: and data: XSS attacks.
     * @param {string} url - URL to validate.
     * @returns {boolean} - True if URL is safe.
     */
    isValidUrl(url) {
        if (!url || typeof url !== 'string') return false;
        try {
            const parsed = new URL(url, window.location.origin);
            // Only allow http, https, and relative URLs
            return ['http:', 'https:', ''].includes(parsed.protocol);
        } catch {
            return false;
        }
    },

    /**
     * Sanitizes user input by removing potentially dangerous characters.
     * @param {string} input - Input to sanitize.
     * @returns {string} - Sanitized input.
     */
    sanitizeInput(input) {
        if (!input || typeof input !== 'string') return '';
        // Remove null bytes and control characters
        return input.replace(/[\x00-\x1F\x7F]/g, '').trim();
    },

    /**
     * Formats a date string for display.
     * @param {string} dateStr - ISO date string.
     * @returns {string} - Formatted date (e.g., "Jan 15, 2026").
     */
    formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    },

    /**
     * Truncates text to a maximum length.
     * @param {string} str - The string to truncate.
     * @param {number} maxLength - Maximum length before truncation.
     * @returns {string} - Truncated string with ellipsis if needed.
     */
    truncate(str, maxLength) {
        if (!str || str.length <= maxLength) return str || '';
        return str.substring(0, maxLength).trim() + '...';
    },

    /**
     * Debounces a function call.
     * @param {Function} fn - Function to debounce.
     * @param {number} delay - Delay in milliseconds.
     * @returns {Function} - Debounced function.
     */
    debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    /**
     * Gets URL query parameter value.
     * @param {string} name - Parameter name.
     * @returns {string|null} - Parameter value or null.
     */
    getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    },

    /**
     * Generates a URL-friendly slug from a string.
     * @param {string} str - The string to slugify.
     * @returns {string} - The slug.
     */
    slugify(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    /**
     * Shows a temporary toast notification.
     * @param {string} message - Message to display.
     * @param {string} type - 'success' | 'error' | 'info'.
     */
    showToast(message, type = 'info') {
        // Remove any existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      z-index: 9999;
      animation: slideIn 0.3s ease;
      background-color: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
        toast.textContent = message;

        // Add animation keyframes if not exists
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Simple confirmation dialog.
     * @param {string} message - Confirmation message.
     * @returns {boolean} - User's choice.
     */
    confirm(message) {
        return window.confirm(message);
    }
};

// Freeze to prevent accidental mutation
Object.freeze(Utils);
