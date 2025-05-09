import { Page, BrowserContext } from '@playwright/test';

export interface AuthState {
    token: string;
    userId: string;
}

/**
 * Create authentication state for tests
 * @param page Playwright page object
 * @returns Authentication state object
 */
export async function createAuthState(page: Page): Promise<AuthState> {
    // Navigate to login page
    await page.goto('/auth/login');

    // Fill in login credentials
    await page.fill('[data-testid="username"]', process.env.TEST_USER || 'test@example.com');
    await page.fill('[data-testid="password"]', process.env.TEST_PASSWORD || 'testpass123');

    // Submit login form
    await page.click('[data-testid="login-button"]');

    // Wait for login to complete
    await page.waitForNavigation();

    // Get authentication token and user ID from local storage
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    const userId = await page.evaluate(() => localStorage.getItem('user_id'));

    if (!token || !userId) {
        throw new Error('Failed to get authentication data after login');
    }

    return {
        token,
        userId,
    };
}

/**
 * Login helper for individual tests
 * @param page Playwright page object
 */
export async function login(page: Page): Promise<void> {
    const context = page.context();
    // Set the stored authentication state
    await context.storageState({
        path: './auth-state.json'
    });
}

/**
 * Helper to create a test user in Casdoor
 */
export async function createTestUser(): Promise<{ username: string, password: string }> {
    const username = `test_${Date.now()}@example.com`;
    const password = 'Test123!@#';

    // Call Casdoor API to create user
    // This is a placeholder - implement actual API call

    return {
        username,
        password
    };
}

/**
 * Helper to clean up test users
 */
export async function cleanupTestUser(username: string): Promise<void> {
    // Call Casdoor API to delete test user
    // This is a placeholder - implement actual API call
}