import { test, expect } from '@playwright/test';

test.describe('Visual Service Validation', () => {
  test('should visually validate AutoGen service', async ({ page }) => {
    await page.goto('https://autogen.omega.spiral.servers');

    // Take snapshot of the page structure
    const snapshot = await page.evaluate(() => {
      const getElementInfo = (element: Element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          text: element.textContent?.trim(),
          visible: rect.width > 0 && rect.height > 0
        };
      };

      const elements = document.querySelectorAll('*');
      return Array.from(elements).map(getElementInfo);
    });

    // Verify key elements are present and visible
    const visibleElements = snapshot.filter(el => el.visible);
    expect(visibleElements.length).toBeGreaterThan(0);

    // Take a screenshot for visual reference
    await page.screenshot({ path: 'autogen-validation.png' });
  });

  test('should visually validate WebUI service', async ({ page }) => {
    await page.goto('https://webui.omega.spiral.servers');

    // Take snapshot and verify UI elements
    const snapshot = await page.evaluate(() => {
      const getElementInfo = (element: Element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          text: element.textContent?.trim(),
          visible: rect.width > 0 && rect.height > 0
        };
      };

      const elements = document.querySelectorAll('*');
      return Array.from(elements).map(getElementInfo);
    });

    const visibleElements = snapshot.filter(el => el.visible);
    expect(visibleElements.length).toBeGreaterThan(0);

    await page.screenshot({ path: 'webui-validation.png' });
  });

  test('should visually validate OpenHands service', async ({ page }) => {
    await page.goto('https://openhands.omega.spiral.servers');

    // Take snapshot and verify UI elements
    const snapshot = await page.evaluate(() => {
      const getElementInfo = (element: Element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          text: element.textContent?.trim(),
          visible: rect.width > 0 && rect.height > 0
        };
      };

      const elements = document.querySelectorAll('*');
      return Array.from(elements).map(getElementInfo);
    });

    const visibleElements = snapshot.filter(el => el.visible);
    expect(visibleElements.length).toBeGreaterThan(0);

    await page.screenshot({ path: 'openhands-validation.png' });
  });
});