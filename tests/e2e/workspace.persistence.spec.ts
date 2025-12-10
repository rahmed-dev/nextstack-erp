import { test, expect } from '../support/fixtures/test-fixtures';

test.describe('Workspace persistence', () => {
  test('S-002: minimal DocType-like data survives app reload (P0)', async ({ page }) => {
    await page.goto('/');

    const noteText = 'Workspace note – persistence smoke';

    await page.getByTestId('workspace-note-input').fill(noteText);
    await page.getByTestId('workspace-note-save').click();

    await expect(page.getByTestId('workspace-note-display')).toHaveText(noteText);

    await page.reload();

    await expect(page.getByTestId('workspace-note-display')).toHaveText(noteText);
  });
});

