#!/bin/bash

echo "🚀 Building Vidyarthi Hub for Production..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "🎉 Build completed successfully!"
echo "📁 Frontend build files are in the 'build' directory"
echo "🔧 Backend is ready for Railway deployment"
echo "🌐 Ready to deploy to vidyarthi-hub.xyz" 