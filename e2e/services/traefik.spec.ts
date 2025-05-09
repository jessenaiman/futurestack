import { test, expect } from '@playwright/test';

const traefikUrl = process.env.TRAEFIK_URL || 'http://172.17.0.1:8080';
const coolifyUrl = process.env.COOLIFY_URL || 'http://172.17.0.1:8000';

test.describe('Traefik Service', () => {
    test('Traefik dashboard is accessible', async ({ page }) => {
        // Navigate to Traefik dashboard
        const response = await page.goto(`${traefikUrl}/dashboard/`, {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        expect(response?.ok()).toBeTruthy();
        await expect(page.locator('text=Traefik')).toBeVisible();
    });

    test('Traefik health check', async ({ request }) => {
        // Check health endpoint
        const response = await request.get(`${traefikUrl}/ping`);
        expect(response.ok()).toBeTruthy();
        expect(await response.text()).toBe('OK');
    });

    test('Traefik SSL configuration', async ({ request }) => {
        // Get response and check for HTTPS upgrade
        const response = await request.get(traefikUrl);
        expect(response.headers()['strict-transport-security']).toBeDefined();
    });

    test('Traefik routing configuration', async ({ request }) => {
        // Test routing for each service
        const services = [
            { url: coolifyUrl, name: 'Coolify' },
        ];

        for (const service of services) {
            const response = await request.head(service.url);
            expect(response.ok()).toBeTruthy();
        }
    });

    test('Traefik error handling', async ({ page }) => {
        // Test 404 handling
        const response = await page.goto(`${traefikUrl}/nonexistent-path`);
        expect(response?.status()).toBe(404);
    });
});
