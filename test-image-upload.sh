#!/bin/bash

# Test script for menu item image upload functionality
# Usage: ./test-image-upload.sh [menuItemId] [imagePath]

# Check if required arguments are provided
if [ -z "$1" ]; then
  echo "Error: Menu item ID is required"
  echo "Usage: ./test-image-upload.sh <menuItemId> [imagePath]"
  exit 1
fi

# Set values from parameters
MENU_ITEM_ID=$1
IMAGE_PATH=${2:-"./water.jpg"}  # Use water.jpg as fallback if no image path provided
API_URL="https://api.alexanderthenotsobad.us/api/images/menu-item/$MENU_ITEM_ID"

# Check if image file exists
if [ ! -f "$IMAGE_PATH" ]; then
  echo "Error: Image file not found at $IMAGE_PATH"
  echo "Please provide a valid image path."
  exit 1
fi

echo "==== Testing Menu Item Image Upload ===="
echo "Menu Item ID: $MENU_ITEM_ID"
echo "Image Path: $IMAGE_PATH"
echo "API URL: $API_URL"
echo ""

# Perform the upload using curl
echo "Uploading image..."
RESPONSE=$(curl -s -X POST -F "image=@$IMAGE_PATH" "$API_URL")

# Check if curl command was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to connect to the API server."
  exit 1
fi

# Check response for success
if [[ "$RESPONSE" == *"Image uploaded successfully"* ]]; then
  echo "✅ Success! Image uploaded successfully."
  echo "Response: $RESPONSE"
  
  # Extract the image ID from the response
  IMAGE_ID=$(echo "$RESPONSE" | grep -o '"imageId":[0-9]*' | cut -d':' -f2)
  
  if [ -n "$IMAGE_ID" ]; then
    echo ""
    echo "==== Testing Image Retrieval ===="
    echo "Testing image retrieval with ID: $IMAGE_ID"
    
    # Test getting the image
    RETRIEVE_URL="https://api.alexanderthenotsobad.us/api/images/menu-item/$IMAGE_ID"
    echo "Retrieve URL: $RETRIEVE_URL"
    echo ""
    echo "Run the following command to verify image retrieval:"
    echo "curl -s -o retrieved-image.jpg \"$RETRIEVE_URL\""
    echo ""
    echo "Then check if retrieved-image.jpg was saved and can be opened."
  fi
else
  echo "❌ Error: Image upload failed."
  echo "Response: $RESPONSE"
fi