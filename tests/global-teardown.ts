import { FullConfig } from '@playwright/test';
import { cleanupTestUser } from './utils/auth';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
    try {
        // Clean up auth state file
        const authStatePath = './auth-state.json';
        if (fs.existsSync(authStatePath)) {
            fs.unlinkSync(authStatePath);
        }

        // Clean up test users if any were created
        const testUserPath = './test-user.json';
        if (fs.existsSync(testUserPath)) {
            const testUser = JSON.parse(fs.readFileSync(testUserPath, 'utf8'));
            await cleanupTestUser(testUser.username);
            fs.unlinkSync(testUserPath);
        }

        // Clean up test artifacts
        const testResultsDir = path.join(process.cwd(), 'test-results');
        if (fs.existsSync(testResultsDir)) {
            fs.rmSync(testResultsDir, { recursive: true, force: true });
        }

        // Clean up any test data in services
        await cleanupTestData();

    } catch (error) {
        console.error('Global teardown failed:', error);
        throw error;
    }
}

async function cleanupTestData() {
    // Clean up test data from database
    // Remove test files from MinIO
    // Reset any modified configurations
}

export default globalTeardown;