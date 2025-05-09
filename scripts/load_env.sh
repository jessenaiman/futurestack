#!/bin/bash
# load_env.sh - Script to load environment variables from .env file
# Usage: source ./scripts/load_env.sh

# Check if .env file exists
ENV_FILE="./.env"
if [ ! -f "$ENV_FILE" ]; then
  # Try parent directory if script is called from scripts/ directory
  ENV_FILE="../.env"
  if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found!"
    return 1
  fi
fi

# Load variables from .env file
echo "Loading environment variables from .env file..."
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  [[ $key =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  
  # Remove quotes if present
  value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
  
  if [ ! -z "$key" ] && [ ! -z "$value" ]; then
    export "$key=$value"
    echo "Exported: $key"
  fi
done < "$ENV_FILE"

echo "Environment variables loaded successfully!"