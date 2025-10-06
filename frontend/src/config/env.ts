// Environment configuration
const PRODUCTION_BACKEND_URL = "https://music-manager-1.onrender.com";

export const config = {
  // API Configuration - Production backend deployed on Render
  API_URL: process.env.REACT_APP_BACKEND_URL || PRODUCTION_BACKEND_URL,

  // Alternative for Vite (if available)
  get VITE_API_URL() {
    try {
      if (typeof import.meta !== "undefined" && import.meta.env) {
        return import.meta.env.VITE_BACKEND_URL || PRODUCTION_BACKEND_URL;
      }
    } catch (error) {
      console.warn("Vite environment not available, using fallback");
    }
    return PRODUCTION_BACKEND_URL;
  },
};

// Export the appropriate API URL (use React environment variables)
export const API_URL = config.API_URL;

// Debug logging for production
if (process.env.NODE_ENV === "production") {
  console.log("🔗 API URL configured:", API_URL);
  console.log("🌍 Environment:", process.env.NODE_ENV);
  console.log("🔧 REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
}
