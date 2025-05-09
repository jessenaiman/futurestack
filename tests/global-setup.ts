import { chromium, FullConfig } from '@playwright/test';
import { createAuthState } from './utils/auth';

async function globalSetup(config: FullConfig) {
    // Create browser for setup tasks
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        // Set up authentication state
        const authState = await createAuthState(page);

        // Save authentication state to be used in tests
        await page.context().storageState({
            path: './auth-state.json'
        });

        // Set up any required test data
        await setupTestData();

    } catch (error) {
        console.error('Global setup failed:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function setupTestData() {
    // Create any necessary test data in the database
    // Reset states to known good configuration
    // Set up test buckets in MinIO
    // Configure test users in Casdoor
}

export default globalSetup;