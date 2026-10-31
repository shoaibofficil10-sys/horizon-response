import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('header keypad supports digits, deletion and a user-controlled telephone handoff',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Open security phone keypad'}).click();
 const dialog=page.locator('#call-dialog');await expect(dialog).toBeVisible();
 await expect(page.locator('#dial-number')).toHaveValue('+61491570006');
 await expect(page.locator('#dial-status')).toContainText('Temporary example number');
 await page.locator('#dial-clear').click();
 await expect(page.locator('#dial-call')).toHaveAttribute('aria-disabled','true');
 for(const digit of '+61400111222') await page.locator(`[data-dial-key="${digit}"]`).click();
 await expect(page.locator('#dial-call')).toHaveAttribute('href','tel:+61400111222');
 await page.getByRole('button',{name:'Delete last digit'}).click();
 await expect(page.locator('#dial-number')).toHaveValue('+6140011122');
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
 await expect(page.getByRole('button',{name:'Open security phone keypad'})).toBeFocused();
});

test('new short homepage section supports keyboard tab selection',async({page})=>{
 await page.goto('/');
 await page.locator('#day-tab-0').focus();await page.keyboard.press('ArrowRight');
 await expect(page.locator('#day-tab-1')).toHaveAttribute('aria-selected','true');
 await expect(page.locator('#day-panel-1')).toBeVisible();
 await expect(page.locator('#day-panel-0')).not.toBeVisible();
 await page.keyboard.press('End');
 await expect(page.locator('#day-panel-2')).toBeVisible();
 await expect(page.locator('#day-panel-2 a')).toHaveAttribute('href',/After-Hours/);
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
