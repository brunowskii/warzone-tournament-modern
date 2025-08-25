import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');
  
  // Should redirect to dashboard
  await expect(page).toHaveURL(/.*dashboard/);
});

test('leaderboard loads', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Should show leaderboard content
  await expect(page.locator('h2')).toContainText('Tournament Leaderboard');
});
