#!/usr/bin/env node

/**
 * Generate a dynamic build version for cache busting
 * This script creates a timestamp-based version that ensures
 * Vercel serves the latest build after each deployment
 */

const fs = require("fs");
const path = require("path");

// Generate timestamp-based version
const now = new Date();
const version = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(
  2,
  "0"
)}-${String(now.getMinutes()).padStart(2, "0")}-${String(
  now.getSeconds()
).padStart(2, "0")}`;

// Create a version file
const versionFile = path.join(__dirname, "..", "public", "version.json");
const versionData = {
  version,
  timestamp: now.toISOString(),
  buildDate: now.toUTCString(),
};

fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2));

console.log(`✅ Build version generated: ${version}`);
console.log(`📝 Version file created at: ${versionFile}`);

// Set environment variable for the build process
process.env.REACT_APP_BUILD_VERSION = version;

// Also create a .env.production.local file for the build
const envFile = path.join(__dirname, "..", ".env.production.local");
const envContent = `REACT_APP_BUILD_VERSION=${version}\nREACT_APP_BUILD_TIMESTAMP=${now.getTime()}\n`;

fs.writeFileSync(envFile, envContent);
console.log(`🔧 Environment file updated: .env.production.local`);
