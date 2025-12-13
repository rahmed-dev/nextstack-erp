import { test, expect } from '../../support/fixtures/test-fixtures';

// Failing ATDD tests for Story 0-1: Shared Listing Framework
// Primary level: E2E (Playwright)
// Patterns applied: network-first, selector-resilience (data-testid), deterministic waits, one assertion per test

test.describe('Shared Listing Framework', () => {
  test.beforeEach(async ({ page }) => {
    // Reset any persisted filter state to ensure isolation
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.removeItem('nextstack.listing.savedViews');
      window.localStorage.removeItem('nextstack.listing.filters');
    });
  });

  test('P0-E2E-1: list variant exposes shared primitives (filters/search/toolbar/actions)', async ({ page }) => {
    // GIVEN: Chart of Accounts list rendered via shared listing (flat variant)
    const filtersPromise = page.waitForResponse((resp) => resp.url().includes('/api/chart-of-accounts') && resp.status() === 200);
    await page.goto('/?module=accounting&view=chart-of-accounts');
    await filtersPromise;

    // WHEN: user applies status/entity filters and text search
    await page.getByTestId('filter-status').click();
    await page.getByRole('option', { name: /active/i }).click();
    await page.getByTestId('filter-entity').click();
    await page.getByRole('option', { name: /main entity/i }).click();
    await page.getByTestId('listing-search').fill('cash');

    // THEN: consistent filter chips + results update
    await expect(page.getByTestId('filter-chip-status')).toContainText(/active/i);
  });

  test('P0-E2E-2: tree variant supports expand/collapse with shared toolbar', async ({ page }) => {
    // GIVEN: Tree listing for Chart of Accounts
    const treeResponse = page.waitForResponse((resp) => resp.url().includes('/api/chart-of-accounts/tree') && resp.status() === 200);
    await page.goto('/?module=accounting&view=chart-of-accounts');
    await treeResponse;

    // WHEN: expanding a parent node
    const parent = page.getByTestId('tree-row-assets');
    await parent.getByTestId('tree-toggle').click();

    // THEN: children become visible using shared row template
    await expect(page.getByTestId('tree-row-cash')).toBeVisible();
  });

  test('P0-E2E-3: shared action slots drive selection + bulk actions', async ({ page }) => {
    const listResponse = page.waitForResponse((resp) => resp.url().includes('/api/clients') && resp.status() === 200);
    await page.goto('/?module=crm&view=clients');
    await listResponse;

    // WHEN: selecting rows and invoking bulk archive
    await page.getByTestId('row-select-client-0').check();
    await page.getByTestId('row-select-client-1').check();
    await page.getByTestId('bulk-action-archive').click();
    await page.getByTestId('confirm-archive').click();

    // THEN: shared status chips update via shared component
    await expect(page.getByTestId('status-chip-archived')).toBeVisible();
  });

  test('P0-E2E-4: saved filter views persist across modules using shared store', async ({ page }) => {
    const listResponse = page.waitForResponse((resp) => resp.url().includes('/api/clients') && resp.status() === 200);
    await page.goto('/?module=crm&view=clients');
    await listResponse;

    const viewName = `Pinned-${Date.now()}`;

    // WHEN: saving a filter view
    await page.getByTestId('filter-status').click();
    await page.getByRole('option', { name: /active/i }).click();
    await page.getByTestId('save-view').click();
    await page.getByTestId('save-view-name').fill(viewName);
    await page.getByTestId('confirm-save-view').click();

    // Navigate to vendors (should reuse shared store)
    const vendorsResponse = page.waitForResponse((resp) => resp.url().includes('/api/vendors') && resp.status() === 200);
    await page.goto('/?module=crm&view=vendors');
    await vendorsResponse;

    // THEN: saved view appears and can be re-applied
    await expect(page.getByTestId('saved-view-item')).toContainText(viewName);
    await page.getByTestId('saved-view-item').filter({ hasText: viewName }).click();
    await expect(page.getByTestId('filter-chip-status')).toContainText(/active/i);
  });

  test('P0-E2E-5: inline row actions use shared confirmation + error surface', async ({ page }) => {
    const listResponse = page.waitForResponse((resp) => resp.url().includes('/api/chart-of-accounts') && resp.status() === 200);
    await page.goto('/?module=accounting&view=chart-of-accounts');
    await listResponse;

    // WHEN: invoking inline delete on a leaf account
    await page.getByTestId('row-actions-cash').getByRole('button', { name: /delete/i }).click();
    await page.getByTestId('confirm-delete').click();

    // THEN: shared error/success surface renders
    await expect(page.getByTestId('toast-success')).toBeVisible();
  });
});
