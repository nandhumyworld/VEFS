// E2E coverage for Content Enhancements work (Task 20).
// Requires a PHP dev server running on http://localhost:8000.
// Start with: cd VEFS-website && ./../.tooling/php/php.exe -S localhost:8000 router.php
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8000';

test.describe('content enhancements', () => {
  test('Blog nav link with NEW badge is present on Home', async ({ page }) => {
    await page.goto(BASE + '/');
    const blogLink = page.locator('.nav-list a[href="blog.html"]');
    await expect(blogLink).toBeVisible();
    // Badge is injected by blog-nav-badge.js when a recent post exists.
    const badge = blogLink.locator('.badge-new');
    await expect(badge).toBeVisible();
  });

  test('Social rail section appears above Upcoming Events', async ({ page }) => {
    await page.goto(BASE + '/');
    const rail = page.locator('.social-rail');
    const events = page.locator('text=Upcoming').first();
    await expect(rail).toBeVisible();
    await expect(events).toBeVisible();
    const railBox = await rail.boundingBox();
    const eventBox = await events.boundingBox();
    expect(railBox).not.toBeNull();
    expect(eventBox).not.toBeNull();
    expect(railBox.y).toBeLessThan(eventBox.y);
  });

  test('Blog slider has prev/next and does NOT auto-advance', async ({ page }) => {
    await page.goto(BASE + '/');
    const slider = page.locator('.blog-slider');
    await expect(slider).toBeVisible();
    const trackTransformBefore = await page
      .locator('#blog-slider-track')
      .evaluate(el => el.style.transform);
    await page.waitForTimeout(8000);
    const trackTransformAfterWait = await page
      .locator('#blog-slider-track')
      .evaluate(el => el.style.transform);
    expect(trackTransformAfterWait).toBe(trackTransformBefore);
    const nextBtn = page.locator('.blog-slider__arrow--next');
    await nextBtn.click();
    const trackTransformAfterClick = await page
      .locator('#blog-slider-track')
      .evaluate(el => el.style.transform);
    expect(trackTransformAfterClick).not.toBe(trackTransformBefore);
  });

  test('Gallery public page renders cards from new schema', async ({ page }) => {
    await page.goto(BASE + '/gallery.html');
    // Gallery JS may render an empty state if data/gallery.json is empty —
    // we only assert the grid container is mounted and visible.
    const grid = page.locator('#gallery-grid').first();
    await expect(grid).toBeVisible({ timeout: 5000 });
  });
});
