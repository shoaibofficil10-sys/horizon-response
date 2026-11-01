import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('testimonial section precedes the footer, identifies samples and supports sector navigation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 expect(await page.locator('main>section').last().getAttribute('id')).toBe('testimonials');
 await expect(page.locator('.testimonial-disclosure')).toContainText('Illustrative testimonials');
 await expect(page.locator('[data-testimonial-slide="0"]')).toBeVisible();
 await page.getByRole('button',{name:'Next testimonial'}).click();
 await expect(page.locator('[data-testimonial-slide="1"]')).toBeVisible();
 await expect(page.locator('#testimonial-current')).toHaveText('02');
 await page.locator('[data-testimonial-index="2"]').click();
 await expect(page.locator('[data-testimonial-slide="2"]')).toBeVisible();
 await expect(page.locator('[data-testimonial-index="2"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('.testimonial-stage').focus();await page.keyboard.press('ArrowRight');
 await expect(page.locator('[data-testimonial-slide="0"]')).toBeVisible();
 await page.getByRole('button',{name:'Previous testimonial'}).click();
 await expect(page.locator('[data-testimonial-slide="2"]')).toBeVisible();
 await expect(page.getByRole('button',{name:'Play testimonial slideshow'})).toHaveAttribute('aria-pressed','true');
});

test('testimonial transitions finish, can pause, and the section fits mobile screens',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Pause testimonial slideshow'}).click();
 await page.getByRole('button',{name:'Next testimonial'}).click();
 await expect(page.locator('#testimonial-current')).toHaveText('02');
 await expect(page.getByRole('button',{name:'Next testimonial'})).toBeEnabled();
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await page.locator('#testimonials').scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const result=await new AxeBuilder({page}).include('#testimonials').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 }
});
