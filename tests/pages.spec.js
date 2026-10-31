import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('hero slideshow fills the viewport and service text remains inset and compact', async ({page}) => {
  for (const width of [390,1440]) {
    await page.setViewportSize({width,height:900});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/');
    const stage=await page.locator('.hero-stage').boundingBox();
    expect(Math.round(stage.width)).toBe(width);
    expect(Math.round(stage.height)).toBe(900);
    await page.getByRole('button',{name:'Next hero slide'}).click();
    await expect(page.locator('h1')).toContainText('Every gathering.');
    await expect(page.locator('#hero-slide-count')).toHaveText('02 / 02');
    await page.getByRole('button',{name:'Previous hero slide'}).click();
    await expect(page.locator('h1')).toContainText('Confidence.');
    const card=await page.locator('.service-card').first().boundingBox();
    const panel=await page.locator('.service-content').first().boundingBox();
    expect(panel.y).toBeGreaterThan(card.y+card.height/2);
    expect(panel.height).toBeLessThan(215);
  }
});

test('About and Contact pages have unique metadata, working navigation and no browser errors', async ({page}) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const [route,title,type] of [['/about/','About Us','AboutPage'],['/contact/','Contact Us','ContactPage']]) {
    const response=await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle(new RegExp(title));
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',`https://horizon-response2.vercel.app${route}`);
    expect(await page.locator('script[type="application/ld+json"]').evaluate(e=>JSON.parse(e.textContent)['@type'])).toBe(type);
    await expect(page.locator('.desktop-nav a[aria-current=page]')).toHaveText(title.toLowerCase().replace(' us',' us'),{ignoreCase:true});
    for(const width of [1440,390]) {
      await page.setViewportSize({width,height:1000});
      const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
    }
    await page.setViewportSize({width:1440,height:1000});
  }
  await page.locator('footer').getByRole('link',{name:'About us'}).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await page.locator('.desktop-nav').getByRole('link',{name:'Contact us'}).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  expect(errors).toEqual([]);
});

test('every page fits mobile and tablet widths; mobile links reach the new pages', async ({page}) => {
  for(const route of ['/','/about/','/contact/']) {
    for(const width of [320,390,768,1024,1440]) {
      await page.setViewportSize({width,height:900});await page.goto(route);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} at ${width}`).toBe(true);
    }
  }
  await page.setViewportSize({width:390,height:844});await page.goto('/about/');
  await page.getByRole('button',{name:'Open navigation'}).click();
  await page.locator('#mobile-nav').getByRole('link',{name:'Contact us'}).click();
  await expect(page).toHaveURL(/\/contact\/$/);
});

test('About page service links reach the contact brief and produce the selected enquiry',async ({page})=>{
  await page.goto('/about/');
  await page.locator('footer [data-service="construction"]').click();
  await page.getByRole('button',{name:'Include in my brief'}).click();
  await expect(page).toHaveURL(/\/contact\/\?service=/);
  await expect(page.locator('input[name=service]:checked')).toHaveValue('Construction Site Security');
  await page.getByLabel('Site location').fill('Melbourne, VIC');
  await page.getByLabel('What do you have in mind?').fill('After-hours access monitoring for a construction project.');
  await page.getByRole('button',{name:'Continue to your details'}).click();
  await page.getByLabel('Your name').fill('Jamie Test');
  await page.getByLabel('Email address').fill('jamie@example.com');
  await page.getByRole('button',{name:'Prepare my security brief'}).click();
  await expect(page.locator('#brief-preview')).toContainText('Construction Site Security');
  await expect(page.locator('#brief-preview')).toContainText('Jamie Test');
});
