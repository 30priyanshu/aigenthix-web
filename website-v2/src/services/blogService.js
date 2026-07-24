/**
 * Blog API service.
 * Centralized API calls for blog data using the core ApiClient.
 */
import { apiClient } from './api';

class BlogService {
  /**
   * Get all blog page data (featured, latest, popular, categories).
   * Single optimized API call.
   */
  async getPageData() {
    try {
      const response = await apiClient.get('/api/blogs/page-data');
      return response.data;
    } catch (error) {
      console.error('BlogService.getPageData error:', error);
      throw error;
    }
  }

  /**
   * Get single blog by slug.
   *
   * @param {string} slug
   */
  async getBlogBySlug(slug) {
    try {
      const response = await apiClient.get(`/api/blogs/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`BlogService.getBlogBySlug("${slug}") error:`, error);
      throw error;
    }
  }
  /**
   * Increment blog view count.
   * Fire and forget - does not block UI.
   *
   * @param {string} slug
   */
  async incrementView(slug) {
    try {
      await apiClient.post(`/api/blogs/${slug}/view`);
    } catch (error) {
      // Silently fail for view counts - don't disrupt user experience
      console.warn(`Failed to increment view for ${slug}`, error);
    }
  }
}

// Singleton instance
export const blogService = new BlogService();
