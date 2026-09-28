import { expect, test, type Page } from '@playwright/test';

async function playMoves(page: Page, indexes: readonly number[]) {
  const cells = page.getByRole('group', { name: 'Tic tac toe board' }).getByRole('button');
  for (const index of indexes) await cells.nth(index).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('E01: X wins using canonical vector', async ({ page }, testInfo) => {
  await playMoves(page, [0, 3, 1, 4, 2]);
  await expect(page.getByRole('status')).toHaveText('Player X wins!');
  await expect(page.getByTestId('score-x')).toHaveText('1');
  const board = page.getByRole('group', { name: 'Tic tac toe board' });
  await expect(board.locator('[data-winning="true"]')).toHaveCount(3);

  // Force dispatches through aria-disabled so the actual handler guard is tested.
  await board.getByRole('button').nth(8).click({ force: true });
  await expect(page.getByTestId('score-x')).toHaveText('1');
  await expect(board.getByRole('button').nth(8)).toHaveAccessibleName('Row 3, column 3: empty');

  await page.screenshot({ path: testInfo.outputPath('x-win.png'), fullPage: true });
});

test('E02: O wins using canonical vector', async ({ page }) => {
  await playMoves(page, [0, 3, 1, 4, 8, 5]);
  await expect(page.getByRole('status')).toHaveText('Player O wins!');
  await expect(page.getByTestId('score-o')).toHaveText('1');
});

test('E03: Draw vector and double-diagonal vector', async ({ page }) => {
  // Draw
  await playMoves(page, [0, 1, 2, 4, 3, 5, 7, 6, 8]);
  await expect(page.getByRole('status')).toHaveText("It's a draw!");
  await expect(page.getByTestId('score-draws')).toHaveText('1');
  
  await page.reload();
  // Double-line vector for X (X starts)
  // X: 1, 3, 5, 7, 4
  // O: 0, 2, 8, 6
  await playMoves(page, [1, 0, 3, 2, 5, 8, 7, 6, 4]);
  await expect(page.getByRole('status')).toHaveText("Player X wins!");
  // Check exactly one point is awarded
  await expect(page.getByTestId('score-x')).toHaveText('1');
  const board = page.getByRole('group', { name: 'Tic tac toe board' });
  await expect(board.locator('[data-winning="true"]')).toHaveCount(5);
});

test('E04: Occupied/terminal/rapid interactions', async ({ page }) => {
  const cells = page.getByRole('group', { name: 'Tic tac toe board' }).getByRole('button');
  
  await cells.nth(0).click();
  // Click occupied cell
  await cells.nth(0).click({ force: true });
  await expect(page.getByRole('status')).toHaveText("Player O's turn");
  
  // Rapid legal moves
  await cells.nth(1).click();
  await cells.nth(2).click();
  await expect(cells.nth(1)).toHaveAccessibleName(/O/);
  await expect(cells.nth(2)).toHaveAccessibleName(/X/);
});

test('E05: Restart unfinished round', async ({ page }) => {
  await playMoves(page, [0, 1]);
  await page.getByRole('button', { name: 'Restart round' }).click();
  await expect(page.getByText('Round 1', { exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText("Player X's turn");
  const board = page.getByRole('group', { name: 'Tic tac toe board' });
  for (let i = 0; i < 9; i++) {
    await expect(board.getByRole('button').nth(i)).toHaveAccessibleName(/empty/);
  }
  await expect(page.getByTestId('score-x')).toHaveText('0');
});

test('E06: Play again after a result', async ({ page }) => {
  await playMoves(page, [0, 3, 1, 4, 2]); // X wins
  await page.getByRole('button', { name: 'Play again' }).click();
  await expect(page.getByText('Round 2', { exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText("Player O's turn");
  await expect(page.getByTestId('score-x')).toHaveText('1');
  const board = page.getByRole('group', { name: 'Tic tac toe board' });
  await expect(board.getByRole('button').first()).toBeFocused();
});

test('E07: Reset cancel / Escape', async ({ page }) => {
  await playMoves(page, [0, 3, 1]);
  await page.getByRole('button', { name: 'Reset match' }).click();
  
  const region = page.getByRole('region', { name: 'Reset the match?' });
  await expect(region).toBeVisible();
  
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(region).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset match' })).toBeFocused();
  
  await page.getByRole('button', { name: 'Reset match' }).click();
  await page.keyboard.press('Escape');
  await expect(region).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset match' })).toBeFocused();
});

test('E08: Confirm reset; refresh separately', async ({ page }) => {
  await playMoves(page, [0, 3, 1, 4, 2]); // X wins
  await page.getByRole('button', { name: 'Reset match' }).click();
  await page.getByRole('button', { name: 'Confirm reset' }).click();
  
  await expect(page.getByText('Round 1', { exact: true })).toBeVisible();
  await expect(page.getByTestId('score-x')).toHaveText('0');
  
  await playMoves(page, [0, 3, 1, 4, 2]);
  await expect(page.getByTestId('score-x')).toHaveText('1');
  await page.reload();
  await expect(page.getByTestId('score-x')).toHaveText('0');
  await expect(page.getByText('Round 1', { exact: true })).toBeVisible();
});
