import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('desktop mega menu opens by keyboard, closes with Escape and opens the selected service',async({page})=>{
 await page.goto('/contact/');
 const trigger=page.locator('.desktop-nav .mega-trigger');
 await trigger.focus();await page.keyboard.press('ArrowDown');
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('.mega-intro a')).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(trigger).toHaveAttribute('aria-expanded','false');
 await expect(trigger).toBeFocused();
 await trigger.click();
 await page.locator('.mega-service[data-service="event"]').click();
 await expect(page.locator('#dialog-title')).toHaveText('Event Security & Crowd Control');
 await expect(trigger).toHaveAttribute('aria-expanded','false');
 await page.getByRole('button',{name:'Include in my brief'}).click();
 await expect(page.locator('input[name=service]:checked')).toHaveValue('Event Security & Crowd Control');
});

test('mobile mega menu fits, contains focus and returns to the navigation',async({page})=>{
 await page.setViewportSize({width:320,height:844});await page.goto('/');
 await page.locator('.menu-toggle').click();
 const trigger=page.locator('#mobile-nav .mega-trigger');await trigger.click();
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 await trigger.focus();await page.keyboard.press('Tab');
 await expect(page.locator('.mega-intro a')).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.mega-close').click();await expect(trigger).toBeFocused();
 await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','true');
});

test('contact copy and form align; open layouts and mega menu pass accessibility checks',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:1440,height:1000});await page.goto('/contact/');
 const copy=await page.locator('.contact-copy').boundingBox(), form=await page.locator('#brief-form').boundingBox();
 expect(Math.abs(copy.y-form.y)).toBeLessThan(2);
 expect(Math.abs(copy.y+copy.height-form.y-form.height)).toBeLessThan(2);
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});await page.goto('/contact/');
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 const heroCopy=await page.locator('.hero-inner').boundingBox(),heroForm=await page.locator('#hero-lead-form').boundingBox();
 expect(Math.abs(heroCopy.y-heroForm.y)).toBeLessThan(2);
 expect(Math.abs(heroCopy.y+heroCopy.height-heroForm.y-heroForm.height)).toBeLessThan(2);
 await page.locator('.desktop-nav .mega-trigger').click();
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});

test('animated hero transitions load the next image and slideshow can be paused',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Pause slideshow'}).click();
 await expect(page.getByRole('button',{name:'Play slideshow'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Next hero slide'}).click();
 await expect(page.locator('#hero-slide-count')).toHaveText('02 / 02');
 await expect(page.locator('.hero-photo').first()).toHaveAttribute('src','/images/security-event-real.webp');
 await expect(page.locator('.hero-photo-incoming')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Next hero slide'})).toBeEnabled();
});
