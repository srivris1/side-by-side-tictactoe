import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('E09: Keyboard-only moves', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard navigation is primarily tested on desktop; mobile touches are simulated differently.');
  
  // Tab to the first cell
  await page.keyboard.press('Tab');
  const board = page.getByRole('group', { name: 'Tic tac toe board' });
  await expect(board.getByRole('button').nth(0)).toBeFocused();
  
  // Activate with Space
  await page.keyboard.press('Space');
  await expect(board.getByRole('button').nth(0)).toHaveAccessibleName(/X/);
  
  // Tab to the next cell and activate with Enter
  await page.keyboard.press('Tab');
  await expect(board.getByRole('button').nth(1)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(board.getByRole('button').nth(1)).toHaveAccessibleName(/O/);
});

test('E10: Viewport geometry', async ({ page }) => {
  const board = page.getByRole('group', { name: 'Tic tac toe board' });
  const box = await board.boundingBox();
  expect(box).not.toBeNull();
  
  // Square board check
  const tolerance = 2; // Allow 2px subpixel rounding tolerance
  expect(Math.abs(box!.width - box!.height)).toBeLessThanOrEqual(tolerance);
  
  // No page overflow
  const htmlWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const windowWidth = await page.evaluate(() => window.innerWidth);
  expect(htmlWidth).toBeLessThanOrEqual(windowWidth);
  
  // Controls >= 44px
  const resetBtn = page.getByRole('button', { name: 'Reset match' });
  const btnBox = await resetBtn.boundingBox();
  expect(btnBox!.height).toBeGreaterThanOrEqual(44);
});

test('E11: Reduced motion', async ({ page }) => {
  // Emulate reduced motion
  await page.emulateMedia({ reducedMotion: 'reduce' });
  
  const cells = page.getByRole('group', { name: 'Tic tac toe board' }).getByRole('button');
  await cells.nth(0).click();
  
  await expect(page.getByRole('status')).toHaveText("Player O's turn");
  await expect(cells.nth(0)).toHaveAccessibleName(/X/);
});

test('E12: Confirmation and rules accessibility', async ({ page }) => {
  // Rules disclosure
  const details = page.locator('details');
  await expect(details).not.toHaveAttribute('open', '');
  await page.getByText('How to play').click();
  await expect(details).toHaveAttribute('open', '');
  
  // Confirmation frozen game
  const cells = page.getByRole('group', { name: 'Tic tac toe board' }).getByRole('button');
  await cells.nth(0).click();
  await page.getByRole('button', { name: 'Reset match' }).click();
  const region = page.getByRole('region', { name: 'Reset the match?' });
  await expect(region).toBeVisible();
  
  // Verify cells are locked
  await expect(cells.nth(0)).toHaveAttribute('aria-disabled', 'true');
  
  // Controls are disabled
  const restartBtn = page.getByRole('button', { name: 'Restart round' });
  await expect(restartBtn).toBeDisabled();
});
