/**
 * Environment configuration.
 * Centralizes all environment variables with fallbacks.
 */

export const config = {
  // API URL from environment variable
  API_URL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",

  // App metadata
  APP_NAME: "AiGENThix",
  APP_URL: import.meta.env.VITE_SITE_URL || "https://aigenthix.com",
};
