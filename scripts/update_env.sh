#!/bin/bash
# update_env.sh - Securely update environment variables
# Usage: ./update_env.sh VARIABLE_NAME

# Check for .env file in current directory
ENV_FILE="./.env"
if [ ! -f "$ENV_FILE" ]; then
  # Try parent directory if script is called from scripts/ directory
  ENV_FILE="../.env"
  if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found!"
    exit 1
  fi
fi

# Check if variable name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 VARIABLE_NAME"
  echo "Example: $0 GITHUB_PERSONAL_ACCESS_TOKEN"
  exit 1
fi

VAR_NAME=$1

# Check if the variable exists in the file
grep -q "^$VAR_NAME=" "$ENV_FILE"
if [ $? -eq 0 ]; then
  # Variable exists, get current value (masked)
  CURRENT_VALUE=$(grep "^$VAR_NAME=" "$ENV_FILE" | cut -d= -f2)
  MASKED_VALUE=$(echo "$CURRENT_VALUE" | sed 's/./*/g; s/......$//')
  echo "Current value of $VAR_NAME: $MASKED_VALUE"
else
  echo "Variable $VAR_NAME not found in $ENV_FILE, will create it"
fi

# Prompt for new value securely
read -s -p "Enter new value for $VAR_NAME: " NEW_VALUE
echo ""

# Confirm the value (optional)
read -s -p "Confirm new value for $VAR_NAME: " CONFIRM_VALUE
echo ""

if [ "$NEW_VALUE" != "$CONFIRM_VALUE" ]; then
  echo "Error: Values do not match"
  exit 1
fi

# Update or create the variable in the file
if grep -q "^$VAR_NAME=" "$ENV_FILE"; then
  # Update existing variable
  sed -i "s|^$VAR_NAME=.*|$VAR_NAME=$NEW_VALUE|" "$ENV_FILE"
else
  # Add new variable
  echo "$VAR_NAME=$NEW_VALUE" >> "$ENV_FILE"
fi

echo "$VAR_NAME has been updated successfully"