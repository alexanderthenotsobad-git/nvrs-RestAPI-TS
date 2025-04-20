#!/bin/bash
# clean-build.sh
# Script to clean JavaScript files from source directories and build the TypeScript project

# Print commands before execution and exit on error
set -ex

# Path to project directory - update if needed
PROJECT_DIR="/var/www/RestAPI"

# Change to project directory
cd $PROJECT_DIR

# Find and delete all JavaScript files in src directory
echo "Cleaning JavaScript files from source directories..."
find ./src -name "*.js" -type f -delete
find ./src -name "*.js.map" -type f -delete

# Clean the dist directory
echo "Cleaning dist directory..."
rm -rf ./dist

# Run TypeScript compiler
echo "Building TypeScript project..."
npm run build

echo "Build process completed successfully!"