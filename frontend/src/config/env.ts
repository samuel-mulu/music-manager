// Environment configuration
export const config = {
  // API Configuration - Production backend deployed on Render
  API_URL:
    process.env.REACT_APP_BACKEND_URL || "https://music-manager-1.onrender.com",

  // Alternative for Vite (if available)
  get VITE_API_URL() {
    try {
      if (typeof import.meta !== "undefined" && import.meta.env) {
        return (
          import.meta.env.VITE_BACKEND_URL ||
          "https://music-manager-1.onrender.com"
        );
      }
    } catch (error) {
      console.warn("Vite environment not available, using fallback");
    }
    return "https://music-manager-1.onrender.com";
  },
};

// Export the appropriate API URL
export const API_URL = config.VITE_API_URL;
