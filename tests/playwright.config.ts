import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './integration',
    timeout: 60_000,
    expect: {
        timeout: 10_000,
    },

    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 1 : undefined,

    reporter: [
        ['html'],
        ['list'],
        ['junit', { outputFile: 'test-results/junit.xml' }],
    ],

    globalSetup: require.resolve('./global-setup'),
    globalTeardown: require.resolve('./global-teardown'),

    use: {
        // Base URL from environment
        baseURL: process.env.TEST_BASE_URL || 'http://172.17.0.1:3210',

        // Handle SSL/HTTPS errors
        ignoreHTTPSErrors: true,

        // Collect trace on failure
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',

        // Increased timeouts for stability
        actionTimeout: 10000,
        navigationTimeout: 15000,

        // Context configuration
        contextOptions: {
            ignoreHTTPSErrors: true,
        },
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                contextOptions: {
                    ignoreHTTPSErrors: true,
                }
            },
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                contextOptions: {
                    ignoreHTTPSErrors: true,
                }
            },
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                contextOptions: {
                    ignoreHTTPSErrors: true,
                }
            },
        },
    ],

    outputDir: 'test-results',
};

export default config;