// E2E coverage for the Projects page.
// Requires a PHP dev server running on http://localhost:8000.
// Start with: cd VEFS-website && php -S localhost:8000 router.php
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8000';

test.describe('Projects page', () => {
  test('listing renders hero, counters and filter bar', async ({ page }) => {
    await page.goto(BASE + '/projects.html');
    await expect(page.locator('h1')).toContainText(/Rooted in action/i);
    await expect(page.locator('[data-counters]')).toBeVisible();
    await expect(page.locator('[data-status-pills]')).toBeVisible();
    await expect(page.locator('[data-theme-pills]')).toBeVisible();
    // Either project cards or the "no projects match" message; both are valid.
    const cards = page.locator('.project-card');
    const emptyMsg = page.locator('text=No projects match these filters');
    await expect(cards.first().or(emptyMsg)).toBeVisible();
  });

  test('clicking the "All" status pill activates it', async ({ page }) => {
    await page.goto(BASE + '/projects.html');
    const all = page.locator('[data-status-pills] button[data-status="all"]');
    await all.click();
    await expect(all).toHaveClass(/is-active/);
  });

  test('donate CTA on a card carries ?project= when projects exist', async ({ page }) => {
    await page.goto(BASE + '/projects.html');
    // If there are no seeded projects, skip — this test is verifying link shape only.
    const firstCardDonate = page.locator('.project-card a[href*="donate.html"]').first();
    if (await firstCardDonate.count() === 0) test.skip(true, 'No seeded projects to assert against');
    const href = await firstCardDonate.getAttribute('href');
    expect(href).toMatch(/donate\.html\?project=/);
  });

  test('detail page returns 404 for an unknown slug', async ({ page }) => {
    const res = await page.goto(BASE + '/projects/does-not-exist');
    expect(res.status()).toBe(404);
    await expect(page.locator('body')).toContainText(/Project not found/i);
  });

  test('Projects nav link is present and Future Plans is not', async ({ page }) => {
    await page.goto(BASE + '/');
    await expect(page.locator('.nav-list a[href="projects.html"]')).toBeVisible();
    await expect(page.locator('.nav-list a[href="future-plans.html"]')).toHaveCount(0);
  });

  test('donate page accepts ?project= and shows "Donating to" label', async ({ page }) => {
    await page.goto(BASE + '/data/projects.json');
    const text = await page.locator('pre, body').first().innerText().catch(() => '');
    let slug;
    try {
      const json = JSON.parse(text);
      const active = (json.projects || []).find(
        (p) => !p.disabled && !p.hiddenFromPublic && p.enabled !== false
      );
      slug = active && active.slug;
    } catch (e) { /* ignore */ }
    if (!slug) test.skip(true, 'No seeded active project to prefill donate page');
    await page.goto(BASE + '/donate.html?project=' + encodeURIComponent(slug));
    // The relabel happens after the fetch resolves; wait briefly.
    await page.waitForTimeout(800);
    const label = page.locator('label[for="donation-category"]');
    await expect(label).toContainText(/Donating to/i);
  });
});
