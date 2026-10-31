import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('header phone drops beneath the header with a locked saved number and fixed call link',async({page})=>{
 for(const width of [1440,390]) {
  await page.setViewportSize({width,height:1000});await page.goto('/');
  const trigger=page.getByRole('button',{name:'Open security phone keypad'});
  await trigger.click();const panel=page.locator('#call-dialog');await expect(panel).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded','true');
  await panel.evaluate(e=>Promise.all(e.getAnimations().map(a=>a.finished)));
  const bounds=await panel.boundingBox(),header=await page.locator('.site-header').boundingBox();
  expect(bounds.y).toBeGreaterThanOrEqual(header.y+header.height);
  expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(width);
  await expect(page.locator('#dial-number')).toHaveAttribute('readonly','');
  await expect(page.locator('#dial-number')).toHaveValue('+61 491 570 006');
  await page.locator('#dial-number').focus();await page.keyboard.type('123456');
  await expect(page.locator('#dial-number')).toHaveValue('+61 491 570 006');
  await expect(page.locator('#dial-call')).toHaveAttribute('href','tel:+61491570006');
  await expect(page.locator('#dial-clear, #dial-delete, #dial-reset')).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'reduce'});
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.keyboard.press('Escape');await expect(panel).not.toBeVisible();await expect(trigger).toBeFocused();
 }
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
