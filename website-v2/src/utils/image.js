/**
 * Image optimization utilities.
 * Shared across all components that display images.
 */

/**
 * Optimize image URL based on provider (Cloudinary, Unsplash).
 * 
 * @param {string} url - Image URL
 * @param {number} width - Desired width
 * @returns {string} Optimized image URL
 */
export function optimizeImage(url, width = 800) {
  if (!url) {
    return `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=${width}&q=80`;
  }

  // Cloudinary optimization
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    return url.replace(
      '/upload/',
      `/upload/w_${width},f_auto,q_auto,c_fill/`
    );
  }

  // Unsplash optimization
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=80&auto=format&fit=crop`;
  }

  return url;
}
