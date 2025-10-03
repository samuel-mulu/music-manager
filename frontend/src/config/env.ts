// Environment configuration
export const config = {
  // API Configuration
  API_URL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000",

  // Alternative for Vite (if available)
  get VITE_API_URL() {
    try {
      if (typeof import.meta !== "undefined" && import.meta.env) {
        return import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      }
    } catch (error) {
      console.warn("Vite environment not available, using fallback");
    }
    return "http://localhost:5000";
  },
};

// Export the appropriate API URL
export const API_URL = config.VITE_API_URL;
