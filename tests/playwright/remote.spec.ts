import { test, expect } from '@playwright/test';

// DuckDNS configuration (will be overridden by environment variables)
const DUCKDNS_DOMAIN = process.env.DUCKDNS_DOMAIN || 'your-subdomain';

const services = [
    {
        name: 'AutoGen Studio',
        path: '/',
        expectedTitle: /AutoGen/i // Title pattern to expect
    },
    {
        name: 'Open WebUI',
        path: '/',
        expectedTitle: /Ollama Web UI/i // Title pattern to expect
    }
];

test.describe('DuckDNS Remote Access Verification', () => {
    test.beforeEach(async ({ page }) => {
        // Skip tests if DUCKDNS_DOMAIN is not set
        test.skip(!process.env.DUCKDNS_DOMAIN, 'DuckDNS domain not configured');
    });

    services.forEach(service => {
        test(`should access ${service.name} via DuckDNS`, async ({ page }) => {
            // Allow self-signed certificates for testing
            test.use({ ignoreHTTPSErrors: true });

            const url = `https://${DUCKDNS_DOMAIN}.duckdns.org${service.path}`;
            console.log(`Testing ${service.name} at ${url}`);

            const response = await page.goto(url);
            expect(response?.status()).toBeLessThan(400); // Ensure successful response

            await expect(page).toHaveTitle(service.expectedTitle);

            // Basic SSL verification
            const sslInfo = await response?.securityDetails();
            if (sslInfo) {
                console.log(`SSL Certificate Info for ${service.name}:`, {
                    issuer: sslInfo.issuer,
                    protocol: sslInfo.protocol,
                    subjectName: sslInfo.subjectName,
                });
            }

            // Performance check
            const timing = await page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                return {
                    loadTime: navigation.loadEventEnd - navigation.startTime,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
                };
            });

            console.log(`Performance metrics for ${service.name}:`, timing);
        });
    });
});
