import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage serves its content, images and search metadata without browser errors', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Security Guard.*Australia/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.service-card')).toHaveCount(6);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /construction.*warehouse.*event/i);
  expect(await page.locator('script[type="application/ld+json"]').evaluate(el => JSON.parse(el.textContent)['@type'])).toBe('Organization');
  for (const image of await page.locator('main img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('all six service panels open, select the right service and close accessibly', async ({ page }) => {
  await page.goto('/');
  for (const card of await page.locator('.service-card').all()) {
    await card.getByRole('button', { name: 'Explore service' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const title = await dialog.locator('h2').textContent();
    await expect(dialog.locator('li')).toHaveCount(4);
    await dialog.getByRole('button', { name: 'Include in my brief' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.locator('input[name=service]:checked')).toHaveValue(title);
    await expect(page.locator('#location')).toBeFocused();
  }
  await page.locator('.service-card').first().getByRole('button', { name: 'Explore service' }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#service-dialog')).not.toBeVisible();
});

test('brief builder validates fields and downloads the user’s actual requirements without submitting', async ({ page }) => {
  const submissions = [];
  page.on('request', request => { if (request.method() === 'POST') submissions.push(request.url()); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Continue to your details' }).click();
  await expect(page.locator('#details-panel')).not.toBeVisible();
  await page.getByRole('radio', { name: 'Construction sites', exact: true }).check();
  await page.getByLabel('Site location').fill('Brisbane, QLD');
  await page.getByLabel('What do you have in mind?').fill('Overnight construction site presence for a two-week project.');
  await page.getByRole('button', { name: 'Continue to your details' }).click();
  await expect(page.locator('#details-panel')).toBeVisible();
  await page.getByRole('button', { name: 'Prepare my security brief' }).click();
  await expect(page.locator('#brief-dialog')).not.toBeVisible();
  await page.getByLabel('Your name').fill('Alex Example');
  await page.getByLabel('Email address').fill('alex@example.com');
  await page.getByLabel('Company / organisation').fill('Example Projects');
  await page.getByLabel('Phone / mobile').fill('0400 000 000');
  await page.getByRole('button', { name: 'Prepare my security brief' }).click();
  await expect(page.locator('#brief-preview')).toContainText('Alex Example');
  await expect(page.locator('#brief-preview')).toContainText('Construction Site Security');
  await expect(page.locator('#brief-dialog')).toContainText('No enquiry has been sent.');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download brief' }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('horizon-response-security-brief.txt');
  const stream = await download.createReadStream();
  let downloaded = '';
  for await (const part of stream) downloaded += part.toString();
  expect(downloaded).toContain('Overnight construction site presence');
  expect(submissions).toEqual([]);
});

test('mobile navigation supports links, Escape, and focus containment', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#mobile-nav a').last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.locator('#mobile-nav').getByRole('link', { name: 'Our services' }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('body')).not.toHaveClass(/menu-open/);
});

test('responsive layouts do not overflow at common mobile, tablet and desktop widths', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`).toBe(true);
  }
});

test('FAQ, privacy dialog and reduced-motion rendering work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const faq = page.locator('details').first();
  await faq.locator('summary').click();
  await expect(faq).toHaveAttribute('open', '');
  await expect(faq.locator('p')).toBeVisible();
  await page.getByRole('button', { name: 'Privacy & your details' }).click();
  await expect(page.locator('#privacy-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#privacy-dialog')).not.toBeVisible();
  expect(await page.locator('.hero-photo').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});

test('homepage has no serious accessibility issues on desktop or mobile', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    await page.getByRole('radio', { name: 'Static guards', exact: true }).check();
    await page.getByLabel('Site location').fill('Melbourne, VIC');
    await page.getByLabel('What do you have in mind?').fill('Weekday reception presence.');
    await page.getByRole('button', { name: 'Continue to your details' }).click();
    const detailsResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(detailsResults.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  }
});

test('two-step brief preserves entries when requirements are edited', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('radio', { name: 'Static guards', exact: true }).check();
  await page.getByLabel('Site location').fill('Sydney, NSW');
  await page.getByLabel('What do you have in mind?').fill('Entry point coverage during business hours.');
  await page.getByRole('button', { name: 'Continue to your details' }).click();
  await expect(page.locator('#requirements-summary')).toContainText('Static Security Guards');
  await page.getByLabel('Your name').fill('Sam Example');
  await page.getByRole('button', { name: 'Edit requirements' }).click();
  await expect(page.getByLabel('Site location')).toHaveValue('Sydney, NSW');
  await page.getByRole('radio', { name: 'Events & crowd control', exact: true }).check();
  await page.getByRole('button', { name: 'Continue to your details' }).click();
  await expect(page.locator('#requirements-summary')).toContainText('Event Security & Crowd Control');
  await expect(page.getByLabel('Your name')).toHaveValue('Sam Example');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.locator('#requirements-panel')).toBeVisible();
  await expect(page.locator('input[name=service]:checked')).toHaveValue('Event Security & Crowd Control');
});
