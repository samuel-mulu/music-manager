// Test environment configuration
// This file helps debug environment variable issues

console.log("🔍 Environment Configuration Test");
console.log("================================");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
console.log(
  "All process.env keys:",
  Object.keys(process.env).filter((key) => key.startsWith("REACT_APP"))
);

// Test the actual configuration
import { API_URL } from "./env";
console.log("Final API_URL:", API_URL);

export default API_URL;
