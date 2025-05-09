import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';

test.describe('LobeChat Integration Tests', () => {
    const baseUrl = process.env.TEST_BASE_URL || 'http://172.17.0.1:3210';
    const traefikUrl = process.env.TRAEFIK_URL || 'http://172.17.0.1:8080';
    const coolifyUrl = process.env.COOLIFY_URL || 'http://172.17.0.1:8000';
    const minioUrl = process.env.MINIO_URL || 'http://172.17.0.1:9000';

    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test.describe('Service Health', () => {
        test('should verify all services are running', async ({ request }) => {
            // Check LobeChat
            const lobeResponse = await request.get(`${baseUrl}/api/health`);
            expect(lobeResponse.ok()).toBeTruthy();

            // Check Traefik
            const traefikResponse = await request.get(`${traefikUrl}/ping`);
            expect(traefikResponse.ok()).toBeTruthy();

            // Check MinIO
            const minioResponse = await request.get(`${minioUrl}/minio/health/live`);
            expect(minioResponse.ok()).toBeTruthy();
        });
    });

    test.describe('Authentication', () => {
        test('should authenticate through Casdoor', async ({ page }) => {
            await page.goto(`${baseUrl}/auth/login`);
            await expect(page.getByRole('heading')).toContainText('Login');

            await page.fill('[data-testid="username"]', process.env.TEST_USER || 'test@example.com');
            await page.fill('[data-testid="password"]', process.env.TEST_PASSWORD || 'testpass123');
            await page.click('[data-testid="login-button"]');

            await expect(page).toHaveURL(/\/chat$/);
        });
    });

    test.describe('Storage Integration', () => {
        test('should upload and retrieve files', async ({ page, request }) => {
            await page.goto(`${baseUrl}/chat`);

            // Upload test file
            await page.setInputFiles('input[type="file"]', 'test-assets/test-file.txt');

            // Verify upload success
            await expect(page.locator('[data-testid="file-attachment"]')).toBeVisible();

            // Verify MinIO is accessible
            const minioResponse = await request.get(`${minioUrl}/minio/health/live`);
            expect(minioResponse.ok()).toBeTruthy();
        });
    });

    test.describe('Chat Functionality', () => {
        test('should send and receive messages', async ({ page }) => {
            await page.goto(`${baseUrl}/chat`);

            // Send test message
            const testMessage = 'Hello, this is a test message';
            await page.fill('[data-testid="chat-input"]', testMessage);
            await page.click('[data-testid="send-button"]');

            // Verify message appears in chat
            await expect(page.locator(`text=${testMessage}`)).toBeVisible();

            // Wait for response
            await expect(page.locator('[data-testid="assistant-message"]')).toBeVisible({ timeout: 30000 });
        });
    });

    test.describe('Performance', () => {
        test('should load chat interface quickly', async ({ page }) => {
            const startTime = Date.now();
            await page.goto(`${baseUrl}/chat`);
            await page.waitForSelector('[data-testid="chat-container"]');
            const loadTime = Date.now() - startTime;
            expect(loadTime).toBeLessThan(5000); // 5 second threshold
        });

        test('should handle file operations efficiently', async ({ page }) => {
            await page.goto(`${baseUrl}/chat`);
            const startTime = Date.now();
            await page.setInputFiles('input[type="file"]', 'test-assets/test-file.txt');
            await page.waitForSelector('[data-testid="file-attachment"]');
            const uploadTime = Date.now() - startTime;
            expect(uploadTime).toBeLessThan(10000); // 10 second threshold
        });
    });
});