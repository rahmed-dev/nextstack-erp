import { test, expect } from '../support/fixtures/test-fixtures';

test.describe('Roles & navigation', () => {
  test('S-003: navigation reflects role permissions (P0)', async ({ page }) => {
    // Owner view: default role (no override needed)

    await page.goto('/');

    await expect(page.getByTestId('nav-dashboard')).toBeVisible();
    await expect(page.getByTestId('nav-accounting')).toBeVisible();
    await expect(page.getByTestId('nav-crm')).toBeVisible();
    await expect(page.getByTestId('nav-projects')).toBeVisible();
    await expect(page.getByTestId('nav-settings')).toBeVisible();

    // Bookkeeper view: override role and navigate again
    await page.evaluate(() => {
      window.localStorage.setItem('nextstack.currentRole', 'Bookkeeper');
    });

    await page.goto('/');

    await expect(page.getByTestId('nav-dashboard')).toBeVisible();
    await expect(page.getByTestId('nav-accounting')).toBeVisible();
    await expect(page.getByTestId('nav-crm')).toHaveCount(0);
    await expect(page.getByTestId('nav-projects')).toHaveCount(0);
    await expect(page.getByTestId('nav-settings')).toHaveCount(0);
  });

  test('S-004: restricted users are blocked from forbidden screens (P0)', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('nextstack.currentRole', 'Bookkeeper');
    });

    await page.goto('/?module=projects');

    await expect(page.getByTestId('forbidden-message')).toBeVisible();

    await expect(page.getByTestId('nav-dashboard')).toBeVisible();
    await expect(page.getByTestId('nav-projects')).toHaveCount(0);
  });
});
