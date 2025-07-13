#!/bin/bash

echo "🚀 Building Vidyarthi Hub for Production (Optimized)..."

# Set Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build/

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build with optimizations
echo "🔨 Building with optimizations..."
GENERATE_SOURCEMAP=false npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in the 'build' directory"
    echo "📊 Bundle size optimized"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Production build completed successfully!"
echo "🌐 Ready to deploy to Vercel" 