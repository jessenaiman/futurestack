#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Relative paths for configuration files
const ENV_EXAMPLE_PATH = path.join(process.cwd(), '.env.example');
const ENV_PATH = path.join(process.cwd(), '.env');

/**
 * Safe project setup script that helps set up the environment
 * without dangerous system modifications
 */
async function setupProject() {
    console.log('🚀 Setting up Future Stack project safely...');

    // Check if .env already exists
    if (!fs.existsSync(ENV_PATH) && fs.existsSync(ENV_EXAMPLE_PATH)) {
        console.log('Creating .env file from template...');
        fs.copyFileSync(ENV_EXAMPLE_PATH, ENV_PATH);
        console.log('✅ Created .env file. Please edit it with your configuration.');
    } else if (fs.existsSync(ENV_PATH)) {
        console.log('✅ .env file already exists.');
    } else {
        console.error('❌ Error: .env.example file not found!');
        process.exit(1);
    }

    // Install dependencies if needed
    console.log('Checking dependencies...');
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
        console.log('Installing dependencies...');
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Dependencies installed.');
    } else {
        console.log('✅ Dependencies already installed.');
    }

    // Setup Docker Compose
    if (fs.existsSync(path.join(process.cwd(), 'docker-compose.yml'))) {
        console.log('Checking Docker Compose setup...');

        const question = (query) => new Promise((resolve) => rl.question(query, resolve));
        const startDocker = await question('Do you want to start Docker services? (y/n): ');

        if (startDocker.toLowerCase() === 'y') {
            try {
                console.log('Starting Docker services...');
                execSync('docker-compose up -d', { stdio: 'inherit' });
                console.log('✅ Docker services started.');
            } catch (error) {
                console.error('❌ Error starting Docker services:', error.message);
            }
        }
    }

    console.log('\n🎉 Project setup complete!');
    console.log('ℹ️  To start working with your project:');
    console.log('   1. Review and update your .env file with your configuration');
    console.log('   2. Run your services using docker-compose');
    console.log('   3. Check the documentation in the README.md file for more details');

    rl.close();
}

setupProject().catch(err => {
    console.error('Error during project setup:', err);
    process.exit(1);
});