import { join } from 'path';
import dotenv from 'dotenv';
import type { PlaywrightTestConfig } from '@playwright/test';

// Environment types
export type Environment = 'local' | 'duckdns' | 'production';

// Configuration interface
export interface TestConfig {
    domain: string;
    mode: Environment;
    baseUrl: string;
}

/**
 * Load environment variables from .env file
 */
export const loadEnv = () => {
    try {
        const envPath = join(process.cwd(), '.env');
        return dotenv.config({ path: envPath }).parsed || {};
    } catch (error) {
        console.error('Error loading .env file:', error);
        return {};
    }
};

/**
 * Get test configuration based on environment
 */
export const getTestConfig = (): TestConfig => {
    const env = loadEnv();
    const useDuckDNS = process.env.DUCKDNS === 'true';
    const isProduction = process.env.NODE_ENV === 'production';

    let domain: string;
    let mode: Environment;

    if (useDuckDNS) {
        domain = `${process.env.DUCKDNS_DOMAIN || env.DUCKDNS_DOMAIN || 'your-subdomain'}.duckdns.org`;
        mode = 'duckdns';
    } else if (isProduction) {
        domain = process.env.DOMAIN || env.DOMAIN || 'omega.spiral.servers';
        mode = 'production';
    } else {
        domain = 'local'; // Changed from 'localhost' to 'local'
        mode = 'local';
    }

    return {
        domain,
        mode,
        baseUrl: domain === 'local' ? 'http://coolify.local' : `https://coolify.${domain}` // Updated to use .local
    };
};

/**
 * Get service URL based on service name and configuration
 */
export const getServiceUrl = (serviceName: string, config: TestConfig): string => {
    return config.mode === 'local'
        ? `http://${serviceName}.local` // Changed from .localhost to .local
        : `https://${serviceName}.${config.domain}`;
};

/**
 * Get service API URL
 */
export const getServiceApiUrl = (serviceName: string, config: TestConfig, path: string = ''): string => {
    const baseUrl = getServiceUrl(serviceName, config);
    return `${baseUrl}/api/v1${path}`;
};

/**
 * Playwright test configuration helper
 */
export const getPlaywrightConfig = (): PlaywrightTestConfig => ({
    use: {
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
    },
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results/test-results.json' }]
    ],
    testDir: './e2e',
    outputDir: 'test-results',
    timeout: 30000,
    retries: process.env.CI ? 2 : 0,
});
