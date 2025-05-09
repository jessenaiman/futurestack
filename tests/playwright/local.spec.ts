import { test, expect } from '@playwright/test';

const localBaseUrl = 'https://192.168.0.61';
const services = [
    { name: 'AutoGen Studio', path: '/', domainStyle: 'autogen.192.168.0.61' },
    { name: 'Open WebUI', path: '/?redirect=false', domainStyle: 'webui.192.168.0.61', directPortPath: 'http://192.168.0.61:3000' },
    // { name: 'All-Hands', path: '/', domainStyle: 'openhands.192.168.0.61' }, // All-Hands removed
];

test.describe('Local Service Verification', () => {
    // Allow self-signed certificates
    test.use({ ignoreHTTPSErrors: true });

    services.forEach(service => {
        test(`should access ${service.name} via IP`, async ({ page }) => {
            const url = `${localBaseUrl}${service.path}`;
            console.log(`Navigating to ${url}`);
            await page.goto(url);
            // Add a basic check, e.g., page title or a specific element
            // This needs refinement based on actual page content
            await expect(page).toHaveTitle(/./); // Basic check for any title
            console.log(`Successfully accessed ${service.name} at ${url}`);
        });

        test(`should access ${service.name} via domain-style name`, async ({ page }) => {
            const url = `https://${service.domainStyle}${service.path}`;
            console.log(`Navigating to ${url}`);
            await page.goto(url);
            await expect(page).toHaveTitle(/./); // Basic check
            console.log(`Successfully accessed ${service.name} at ${url}`);
        });

        if (service.directPortPath) {
            test(`should access ${service.name} via direct port`, async ({ page }) => {
                const url = service.directPortPath;
                console.log(`Navigating to ${url}`);
                await page.goto(url);
                await expect(page).toHaveTitle(/./); // Basic check
                console.log(`Successfully accessed ${service.name} at ${url}`);
            });
        }
    });
});
