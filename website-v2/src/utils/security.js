/**
 * Security utilities for XSS protection and input sanitization.
 * Uses DOMPurify for HTML sanitization.
 */
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe HTML tags and attributes for blog content.
 * 
 * @param {string} dirty - Unsanitized HTML string
 * @param {Object} options - DOMPurify configuration options
 * @returns {string} - Sanitized HTML string
 */
export function sanitizeHtml(dirty, options = {}) {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // Default configuration for blog content
  const defaultConfig = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img', 'iframe',
      'div', 'span', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
      'width', 'height', 'frameborder', 'allowfullscreen', 'allow',
      'style', 'data-*'
    ],
    ALLOW_DATA_ATTR: true,
    // Allow YouTube and Vimeo embeds
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  };

  const config = { ...defaultConfig, ...options };

  return DOMPurify.sanitize(dirty, config);
}

/**
 * Sanitize plain text (removes all HTML).
 * 
 * @param {string} text - Text that may contain HTML
 * @returns {string} - Plain text without HTML
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

/**
 * Validate URL to prevent javascript: and data: XSS attacks.
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is safe
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const parsed = new URL(url, window.location.origin);
    // Only allow http, https, and relative URLs
    return ['http:', 'https:', ''].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Escape special characters in user input for display.
 * Use this when you need to display user input as plain text.
 * 
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
export function escapeHtml(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
