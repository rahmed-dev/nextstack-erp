import { test, expect } from '../support/fixtures/test-fixtures';

test.describe('Roles & Access settings (Story 3.6)', () => {
  test('P0-1: default roles visible and editable', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.removeItem('nextstack.rolesConfig');
      window.localStorage.setItem('nextstack.currentRole', 'System Admin');
    });
    await page.goto('/?module=settings');

    await expect(page.getByTestId('role-row-system-admin')).toBeVisible();
    await expect(page.getByTestId('role-row-accounts-user')).toBeVisible();
    await expect(page.getByTestId('role-row-project-user')).toBeVisible();
    await expect(page.getByTestId('role-row-crm-user')).toBeVisible();

    const labelInput = page.getByTestId('role-label-accounts-user');
    await labelInput.fill('Accounts User (Renamed)');

    await page.getByTestId('roles-save').click();
    await page.goto('/?module=settings');

    await expect(page.getByTestId('role-label-accounts-user')).toHaveValue(
      'Accounts User (Renamed)'
    );
  });

  test('P0-2/P0-3: module access configuration persisted and respected by navigation', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.removeItem('nextstack.rolesConfig');
      window.localStorage.setItem('nextstack.currentRole', 'System Admin');
    });
    await page.goto('/?module=settings');

    const accountsAccounting = page.getByTestId(
      'role-module-accounts-user-accounting'
    );
    const accountsProjects = page.getByTestId(
      'role-module-accounts-user-projects'
    );

    await expect(accountsAccounting).toBeChecked();
    await expect(accountsProjects).not.toBeChecked();

    await accountsProjects.check();
    await page.getByTestId('roles-save').click();

    await page.evaluate(() => {
      window.localStorage.setItem('nextstack.currentRole', 'Accounts User');
    });

    await page.goto('/');

    await expect(page.getByTestId('nav-dashboard')).toBeVisible();
    await expect(page.getByTestId('nav-accounting')).toBeVisible();
    await expect(page.getByTestId('nav-projects')).toBeVisible();
    await expect(page.getByTestId('nav-crm')).toHaveCount(0);
  });

  test('P0-4: direct access to forbidden module is blocked with clear message', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.removeItem('nextstack.rolesConfig');
      window.localStorage.setItem('nextstack.currentRole', 'System Admin');
    });
    await page.goto('/?module=settings');

    const accountsProjects = page.getByTestId(
      'role-module-accounts-user-projects'
    );

    await expect(accountsProjects).not.toBeChecked();
    await accountsProjects.uncheck();
    await page.getByTestId('roles-save').click();

    await page.evaluate(() => {
      window.localStorage.setItem('nextstack.currentRole', 'Accounts User');
    });

    await page.goto('/?module=projects');

    await expect(page.getByTestId('forbidden-message')).toBeVisible();
    await expect(page.getByTestId('nav-projects')).toHaveCount(0);
  });
});
