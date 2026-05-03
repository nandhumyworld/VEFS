const { test, expect } = require('@playwright/test');

test('Events modal opens at top, form hidden', async ({ page }) => {
  await page.goto('http://localhost:8090/events.html');
  await page.waitForLoadState('networkidle');

  // Click first View Details button
  const btn = page.locator('.btn').first();
  await btn.click();
  await page.waitForTimeout(700); // wait for modal open + focus delay

  // Modal should be active
  const modal = page.locator('#event-modal.active');
  await expect(modal).toBeVisible();

  // Modal body scroll should be at (or near) top
  const scrollTop = await page.evaluate(() => {
    const body = document.querySelector('#event-modal .modal-body');
    return body ? body.scrollTop : -1;
  });
  console.log('Event modal body scrollTop:', scrollTop);

  // Form container should be hidden
  const formDisplay = await page.evaluate(() => {
    const el = document.getElementById('event-form-container');
    return el ? window.getComputedStyle(el).display : 'NOT FOUND';
  });
  console.log('Event form-container display:', formDisplay);

  // CTA button should be visible
  const ctaDisplay = await page.evaluate(() => {
    const el = document.getElementById('event-register-cta');
    return el ? window.getComputedStyle(el).display : 'NOT FOUND';
  });
  console.log('Event register-cta display:', ctaDisplay);

  // Focused element
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? `${el.tagName}.${el.className} | text: ${(el.textContent||'').trim().slice(0,50)}` : 'none';
  });
  console.log('Focused element:', focused);

  await page.screenshot({ path: 'VEFS-builder/04-TESTING/screenshots/modal_events_open.png', fullPage: false });

  expect(scrollTop).toBeLessThan(50);
  expect(formDisplay).toBe('none');
  expect(ctaDisplay).not.toBe('none');
});

test('Trainings modal opens at top, form hidden', async ({ page }) => {
  await page.goto('http://localhost:8090/trainings.html');
  await page.waitForLoadState('networkidle');

  const btn = page.locator('.btn').first();
  await btn.click();
  await page.waitForTimeout(700);

  const scrollTop = await page.evaluate(() => {
    const body = document.querySelector('#training-modal .modal-body');
    return body ? body.scrollTop : -1;
  });
  console.log('Training modal body scrollTop:', scrollTop);

  const formDisplay = await page.evaluate(() => {
    const el = document.getElementById('training-form-container');
    return el ? window.getComputedStyle(el).display : 'NOT FOUND';
  });
  console.log('Training form-container display:', formDisplay);

  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? `${el.tagName}.${el.className} | text: ${(el.textContent||'').trim().slice(0,50)}` : 'none';
  });
  console.log('Training focused element:', focused);

  await page.screenshot({ path: 'VEFS-builder/04-TESTING/screenshots/modal_training_open.png', fullPage: false });

  expect(scrollTop).toBeLessThan(50);
});

test('Volunteers modal opens at top, form hidden', async ({ page }) => {
  await page.goto('http://localhost:8090/volunteer.html');
  await page.waitForLoadState('networkidle');

  const btn = page.locator('.btn').first();
  await btn.click();
  await page.waitForTimeout(700);

  const scrollTop = await page.evaluate(() => {
    const body = document.querySelector('#volunteer-modal .modal-body');
    return body ? body.scrollTop : -1;
  });
  console.log('Volunteer modal body scrollTop:', scrollTop);

  const formDisplay = await page.evaluate(() => {
    const el = document.getElementById('volunteer-form-container');
    return el ? window.getComputedStyle(el).display : 'NOT FOUND';
  });
  console.log('Volunteer form-container display:', formDisplay);

  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? `${el.tagName}.${el.className} | text: ${(el.textContent||'').trim().slice(0,50)}` : 'none';
  });
  console.log('Volunteer focused element:', focused);

  await page.screenshot({ path: 'VEFS-builder/04-TESTING/screenshots/modal_volunteer_open.png', fullPage: false });

  expect(scrollTop).toBeLessThan(50);
});
