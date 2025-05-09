const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

/**
 * Safe environment loader that handles environment variables securely
 * without modifying system settings or exposing sensitive data.
 */
function loadEnvironment() {
    try {
        // Path to the .env file (root of the project)
        const envPath = path.resolve(process.cwd(), '.env');

        // Check if .env file exists
        if (!fs.existsSync(envPath)) {
            console.warn('Warning: .env file not found in the project root.');
            console.log('Please copy .env.example to .env and configure your environment variables.');
            return false;
        }

        // Load environment variables from .env file
        const result = dotenv.config({ path: envPath });

        if (result.error) {
            console.error('Error loading .env file:', result.error);
            return false;
        }

        console.log('Environment variables loaded successfully.');
        return true;
    } catch (error) {
        console.error('Unexpected error loading environment variables:', error);
        return false;
    }
}

module.exports = loadEnvironment;