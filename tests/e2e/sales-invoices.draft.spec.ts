import { test, expect } from '../support/fixtures/test-fixtures';

test.describe('Sales invoices – Draft (Story 1.3)', () => {
  test('P0-1: create valid Draft invoice with correct totals', async ({ page }) => {
    await page.goto('/?module=accounting');

    // Fill in minimal sales invoice form
    await page.getByTestId('sales-invoice-client').fill('Client A');
    await page.getByTestId('sales-invoice-invoice-date').fill('2025-01-01');
    await page.getByTestId('sales-invoice-due-date').fill('2025-01-15');
    await page.getByTestId('sales-invoice-currency').fill('USD');

    await page.getByTestId('sales-invoice-line-quantity').fill('2');
    await page.getByTestId('sales-invoice-line-rate').fill('100');
    await page.getByTestId('sales-invoice-tax-rate').fill('10'); // 10%
    await page.getByTestId('sales-invoice-discount-rate').fill('5'); // 5%

    await page.getByTestId('sales-invoice-save').click();

    // Net: 2 * 100 = 200
    // Tax: 10% of 200 = 20
    // Discount: 5% of 200 = 10
    // Grand total: 200 + 20 - 10 = 210
    await expect(page.getByTestId('sales-invoice-total-net')).toHaveText('200.00');
    await expect(page.getByTestId('sales-invoice-total-tax')).toHaveText('20.00');
    await expect(page.getByTestId('sales-invoice-total-discount')).toHaveText('10.00');
    await expect(page.getByTestId('sales-invoice-total-grand')).toHaveText('210.00');

    // Status remains Draft
    await expect(page.getByTestId('sales-invoice-status')).toHaveText(/Draft/i);
  });

  test('P0-2: editing Draft invoice preserves status and recalculates totals', async ({ page }) => {
    await page.goto('/?module=accounting');

    // Assume an invoice already exists or is created via the UI.
    await page.getByTestId('sales-invoice-client').fill('Client B');
    await page.getByTestId('sales-invoice-line-quantity').fill('1');
    await page.getByTestId('sales-invoice-line-rate').fill('100');
    await page.getByTestId('sales-invoice-save').click();

    await expect(page.getByTestId('sales-invoice-total-grand')).toHaveText('100.00');

    // Edit line item
    await page.getByTestId('sales-invoice-line-quantity').fill('3');
    await page.getByTestId('sales-invoice-save').click();

    // New total: 3 * 100 = 300
    await expect(page.getByTestId('sales-invoice-total-grand')).toHaveText('300.00');

    // Still Draft
    await expect(page.getByTestId('sales-invoice-status')).toHaveText(/Draft/i);
  });

  test('P0-3: invalid Draft invoices are blocked with clear validation', async ({ page }) => {
    await page.goto('/?module=accounting');

    // Missing client
    await page.getByTestId('sales-invoice-client').fill('');
    await page.getByTestId('sales-invoice-line-quantity').fill('1');
    await page.getByTestId('sales-invoice-line-rate').fill('100');
    await page.getByTestId('sales-invoice-save').click();

    await expect(page.getByTestId('sales-invoice-error-client')).toBeVisible();

    // Negative quantity
    await page.getByTestId('sales-invoice-client').fill('Client C');
    await page.getByTestId('sales-invoice-line-quantity').fill('-1');
    await page.getByTestId('sales-invoice-save').click();

    await expect(page.getByTestId('sales-invoice-error-quantity')).toBeVisible();
  });
});
