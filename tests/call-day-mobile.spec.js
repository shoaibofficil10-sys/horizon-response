import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('header contact and Why us replace the phone across pages',async({page})=>{
 for(const route of ['/','/about/','/contact/']){
  await page.goto(route);await expect(page.locator('.header-email')).toBeVisible();await expect(page.locator('.header-email')).toHaveAttribute('href','mailto:info@horizonresponse.example');
  await expect(page.locator('[href^="tel:"],#call-dialog,[data-open-call]')).toHaveCount(0);
  await expect(page.locator('.desktop-nav a').filter({hasText:'Why us'})).toHaveAttribute('href',route==='/'?'#why-us':'/#why-us');
 }
 await page.goto('/');await page.locator('.desktop-nav a').filter({hasText:'Why us'}).click();await expect(page).toHaveURL(/#why-us$/);
 await expect(page.locator('#why-us')).toBeInViewport();
});

test('new short homepage section supports keyboard tab selection',async({page})=>{
 await page.goto('/');
 await page.locator('#day-tab-0').focus();await page.keyboard.press('ArrowRight');
 await expect(page.locator('#day-tab-1')).toHaveAttribute('aria-selected','true');
 await expect(page.locator('#day-panel-1')).toBeVisible();
 await expect(page.locator('#day-panel-0')).not.toBeVisible();
 await page.keyboard.press('End');
 await expect(page.locator('#day-panel-2')).toBeVisible();
 await expect(page.locator('#day-panel-2 a')).toHaveAttribute('href','/#services');
 await expect(page.locator('#day-panel-2')).toContainText('healthcare');
});

test('mobile shows two complete service cards per row without horizontal page overflow',async({page})=>{
 for(const width of [320,390,430]){
  await page.setViewportSize({width,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  const layout=await page.locator('.service-grid').evaluate(e=>{
   const g=e.getBoundingClientRect(),c=[...e.querySelectorAll('.service-card')].map(n=>n.getBoundingClientRect());
   return {twoFit:c[0].left>=g.left-1&&c[1].right<=g.right+1,thirdOverflows:c[2].left>=g.right-1,pairedRows:c.slice(0,5).every((r,i)=>Math.abs(r.left-c[i+5].left)<1),cardHeights:c.every(r=>r.height<=300)};
  });
  expect(layout).toEqual({twoFit:true,thirdOverflows:true,pairedRows:true,cardHeights:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
