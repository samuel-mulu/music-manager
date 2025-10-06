#!/bin/bash

# 🚀 Vercel Deployment Script for Addis Software Frontend
# This script helps deploy the frontend to Vercel

echo "🎵 Addis Software - Frontend Deployment to Vercel"
echo "================================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the frontend directory."
    exit 1
fi

echo "✅ Installing dependencies..."
npm install

echo "✅ Building for production..."
npm run build:production

echo "✅ Testing build..."
if [ ! -d "build" ]; then
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo "✅ Build successful!"

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete!"
echo "📱 Your app should be live at the URL provided above."
echo "🔗 Backend: https://music-manager-1.onrender.com"
