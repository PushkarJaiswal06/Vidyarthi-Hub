#!/bin/bash

echo "🚀 Deploying Vidyarthi Hub Frontend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project
echo "📦 Building frontend..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment completed!"
echo "🌐 Your app should be available at: https://vidyarthi-hub.xyz"
echo "📊 Check Vercel dashboard for deployment status" 