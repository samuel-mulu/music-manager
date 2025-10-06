// Environment configuration
const PRODUCTION_BACKEND_URL = "https://music-manager-1.onrender.com";
const DEVELOPMENT_BACKEND_URL = "http://localhost:5000";

// Determine the API URL based on environment
function getApiUrl(): string {
  // Check if we're running on Vercel (production deployment)
  const isVercelDeployment = window.location.hostname.includes('vercel.app') || 
                            window.location.hostname.includes('vercel.com');
  
  // If we're in production or on Vercel, always use production backend
  if (process.env.NODE_ENV === 'production' || isVercelDeployment) {
    return PRODUCTION_BACKEND_URL;
  }
  
  // For development, use environment variable or fallback to localhost
  return process.env.REACT_APP_BACKEND_URL || DEVELOPMENT_BACKEND_URL;
}

export const config = {
  // API Configuration - Smart environment detection
  API_URL: getApiUrl(),

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

// Export the appropriate API URL (smart detection)
export const API_URL = config.API_URL;

// Debug logging for production
if (process.env.NODE_ENV === "production") {
  console.log("🔗 API URL configured:", API_URL);
  console.log("🌍 Environment:", process.env.NODE_ENV);
  console.log("🔧 REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
  console.log("🌐 Hostname:", window.location.hostname);
  console.log("🚀 Is Vercel deployment:", window.location.hostname.includes('vercel.app') || window.location.hostname.includes('vercel.com'));
}
