import { test, expect } from '@playwright/test';

test.describe('Beer Road Save - Playwright Tests', () => {
  test('home page loads with hero and search', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Beer Road Save');
    await expect(page.locator('input[name="search"]')).toBeVisible();
  });

  test('breweries page loads with filter bar', async ({ page }) => {
    await page.goto('/breweries');
    await expect(page.locator('h1')).toContainText('Breweries');
    const selects = await page.locator('select').count();
    expect(selects).toBeGreaterThanOrEqual(4);
  });

  test('login page loads with form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Welcome back');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('register page loads with form', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h1')).toContainText('Create an account');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('trips page redirects when not logged in', async ({ page }) => {
    await page.goto('/trips');
    await expect(page).toHaveURL(/.*login/);
  });

  test('404 page renders for unknown route', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.locator('h2')).toContainText('Page Not Found');
  });

  test('challenges page loads with roulette', async ({ page }) => {
    await page.goto('/challenges');
    await expect(page.locator('h1')).toContainText('Challenges');
    await expect(page.locator('text=🎰 Challenge Roulette')).toBeVisible();
  });

  test('beers API returns data', async ({ page }) => {
    const response = await page.request.get('/api/beers');
    expect(response.ok()).toBe(true);
    const json = await response.json();
    expect(json.data).toBeDefined();
    expect(json.total).toBeGreaterThan(0);
  });

  test('challenges API returns data', async ({ page }) => {
    const response = await page.request.get('/api/challenges');
    expect(response.ok()).toBe(true);
    const json = await response.json();
    expect(json.data).toBeDefined();
    expect(json.total).toBeGreaterThan(0);
  });
});
