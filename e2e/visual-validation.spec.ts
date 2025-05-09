import { test, expect } from '@playwright/test';

const baseUrl = process.env.TEST_BASE_URL || 'http://172.17.0.1:3210';

test.describe('Visual Service Validation', () => {
  test('should visually validate LobeChat service', async ({ page }) => {
    await page.goto(baseUrl);

    // Take snapshot and verify UI elements
    const snapshot = await page.evaluate(() => {
      return {
        title: document.title,
        heading: document.querySelector('h1')?.textContent,
        mainContent: document.querySelector('main')?.innerHTML,
      };
    });

    // Verify basic UI elements
    expect(snapshot.title).toContain('LobeChat');
    expect(snapshot.heading).toBeTruthy();
    expect(snapshot.mainContent).toBeTruthy();

    // Screenshot for visual comparison
    await page.screenshot({
      path: 'test-results/screenshots/lobe-chat-main.png',
      fullPage: true
    });
  });

  test('should test interactive elements', async ({ page }) => {
    await test.step('Testing Chat Interface', async () => {
      await page.goto(`${baseUrl}/chat`);
      await page.waitForLoadState('networkidle');

      // Verify chat components
      await expect(page.locator('[data-testid="chat-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="send-button"]')).toBeVisible();

      // Test input interaction
      await page.fill('[data-testid="chat-input"]', 'Hello, test message');
      await page.click('[data-testid="send-button"]');

      // Verify message appears
      await expect(page.locator('text=Hello, test message')).toBeVisible();
    });

    await test.step('Testing File Upload', async () => {
      // Test file upload functionality
      await page.setInputFiles('input[type="file"]', 'test-assets/test-file.txt');
      await expect(page.locator('[data-testid="file-attachment"]')).toBeVisible();
    });

    await test.step('Testing Settings Panel', async () => {
      await page.click('[data-testid="settings-button"]');
      await expect(page.locator('[data-testid="settings-panel"]')).toBeVisible();
    });
  });
});