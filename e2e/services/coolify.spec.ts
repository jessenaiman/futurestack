import { test, expect } from '@playwright/test';

const coolifyUrl = process.env.COOLIFY_URL || 'http://172.17.0.1:8000';

test.describe('Coolify Service', () => {
    test('Coolify dashboard is accessible', async ({ page }) => {
        // Navigate to Coolify dashboard
        const response = await page.goto(coolifyUrl, {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        expect(response?.ok()).toBeTruthy();
        await expect(page.locator('text=Coolify')).toBeVisible();
    });

    test('Coolify API health check', async ({ request }) => {
        // Check API health endpoint
        const apiUrl = `${coolifyUrl}/api/v1/health`;
        const response = await request.get(apiUrl);
        expect(response.ok()).toBeTruthy();
    });

    test('Coolify service routing through Traefik', async ({ request }) => {
        // Check if Traefik is properly routing requests
        const response = await request.head(coolifyUrl);
        expect(response.ok()).toBeTruthy();

        // Verify Traefik headers
        const headers = response.headers();
        expect(headers['x-powered-by']).toBe('Traefik');
    });
});
