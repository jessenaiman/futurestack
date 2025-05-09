#!/bin/bash

# Script to deploy RabbitHoles to Coolify
# This implements GitHub Issue #8

echo "🐰 Deploying RabbitHoles to Coolify"
echo "-----------------------------------"

# Load environment variables
if [ -f "../.env" ]; then
  echo "Loading environment variables from .env file"
  source "../.env"
else
  echo "No .env file found, using default or provided values"
fi

# Check if we're in the right directory
if [ -d "../rabbit-holes" ]; then
  echo "Found local rabbit-holes directory."
else
  echo "Warning: rabbit-holes directory not found, this isn't critical but ensure the correct repository URL is used in Coolify."
fi

# Set API keys
TAVILY_API_KEY="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"
GOOGLE_AI_API_KEY="AIzaSyDxzHkaltVyQNhplWqpQYUabvs-nBFo_iM"
GOOGLE_AI_MODEL="gemini-2.0-flash"

echo "📦 Preparing RabbitHoles deployment"
echo "1. Repository: https://github.com/AsyncFuncAI/rabbitholes (correct official repository)"
echo "2. Database: PostgreSQL using Neon (rabbitholes database)"
echo "3. Connection string: postgresql://neondb_owner:npg_lRx9YrSMzu0t@ep-shy-resonance-a4i3hldm-pooler.us-east-1.aws.neon.tech/rabbitholes?sslmode=require"
echo "4. API Keys: Using provided Tavily and Google AI keys"
echo "5. Google LLM Model: gemini-2.0-flash"

# Instructions for manual steps in Coolify
echo ""
echo "🚀 Next steps for deployment in Coolify:"
echo "---------------------------------------"
echo "1. Open your Coolify dashboard"
echo "2. Click on 'Create new resource'"
echo "3. Select 'Application' -> 'From source code'"
echo "4. Choose GitHub as the source and select the 'AsyncFuncAI/rabbitholes' repository"
echo "5. Configure the deployment with the following settings:"
echo "   - Name: rabbitholes"
echo "   - Build command: npm install && npm run build"
echo "   - Start command: npm start"
echo "   - Port: 3001"
echo "   - Environment variables:"
echo "     * PORT=3001"
echo "     * NODE_ENV=production"
echo "     * TAVILY_API_KEY=${TAVILY_API_KEY}"
echo "     * GOOGLE_AI_API_KEY=${GOOGLE_AI_API_KEY}"
echo "     * GOOGLE_AI_MODEL=${GOOGLE_AI_MODEL}"
echo "     * DATABASE_URL=postgresql://neondb_owner:npg_lRx9YrSMzu0t@ep-shy-resonance-a4i3hldm-pooler.us-east-1.aws.neon.tech/rabbitholes?sslmode=require"
echo "6. In 'Destination' settings, enable HTTPS and set the domain to 'rabbitholes.localhost'"
echo "7. Click 'Save' and deploy"
echo ""
echo "For troubleshooting, check:"
echo "- Coolify logs for any deployment errors"
echo "- Network connectivity to Neon database"
echo "- API keys validation for Tavily and Google AI"
echo ""
echo "⚠️ Note: Be mindful of issues #2 (Coolify deployment) and #13 (security configuration)"
echo "  as mentioned in your GitHub tasks."
echo ""
echo "✅ Script completed. Follow the manual steps above to complete the deployment."