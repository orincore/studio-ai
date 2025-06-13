#!/bin/bash

npm install

# Build the project
npm run build

# Ensure _redirects file exists in dist
cp public/_redirects dist/_redirects

echo "Build completed"

# Start the server with SPA mode
npx serve -s dist 