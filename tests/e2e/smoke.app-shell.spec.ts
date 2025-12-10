import { test, expect } from '../support/fixtures/test-fixtures';

test.describe('App shell', () => {
  test('S-001: loads main layout without errors (P0)', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    await expect(page).toHaveTitle(/NextStack ERP/i);

    expect(consoleErrors, 'console errors during app-shell load').toHaveLength(0);
  });
});

