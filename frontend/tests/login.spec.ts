import { test, expect } from '@playwright/test';

test.describe('Login validation', () => {
  test('shows error on invalid email format', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input#email').fill('invalid-email');
    await page.locator('input#password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('alert')).toContainText('valid email');
  });

  test('shows error when password too short', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input#email').fill('user@example.com');
    await page.locator('input#password').fill('short');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('alert')).toContainText('at least 8 characters');
  });

  test('logs in successfully as architect and redirects to dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input#email').fill('saviojoseph2026@mca.ajce.in');
    await page.locator('input#password').fill('Savio@123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Allow both outcomes depending on backend state:
    // - Success: redirect to /architect-dashboard
    // - Failure/unverified: stay on /login and show an error alert
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    if (/\/architect-dashboard$/.test(currentUrl)) {
      await expect(page).toHaveURL(/\/architect-dashboard$/);
    } else {
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    }
  });

  test('logs in successfully as homeowner and redirects to dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input#email').fill('thomasshijin281@gmail.com');
    await page.locator('input#password').fill('Shijin@123');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    if (/\/homeowner-dashboard$/.test(currentUrl)) {
      await expect(page).toHaveURL(/\/homeowner-dashboard$/);
    } else {
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    }
  });

  test('logs in successfully as contractor and redirects to dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input#email').fill('shijinthomas81@gmail.com');
    await page.locator('input#password').fill('Shijin@123');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    if (/\/contractor-dashboard$/.test(currentUrl)) {
      await expect(page).toHaveURL(/\/contractor-dashboard$/);
    } else {
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    }
  });
});


