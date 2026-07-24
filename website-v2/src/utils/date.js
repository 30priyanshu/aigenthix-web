/**
 * Date formatting utilities.
 * Shared across all components that display dates.
 */

/**
 * Format date string to human-readable format.
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "December 10, 2024")
 */
export function formatDate(dateString) {
  if (!dateString) return 'Recent';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Invalid date:', dateString);
    return 'Recent';
  }
}
