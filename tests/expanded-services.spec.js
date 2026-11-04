import {test,expect} from '@playwright/test';

test('desktop mega menu opens on hover and stays open while entering its panel',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 const trigger=page.locator('.desktop-nav .mega-trigger');await trigger.hover();
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 await page.locator('.mega-service[data-quote="campus"]').hover();
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 await page.locator('.mega-service[data-quote="campus"]').click();
 await expect(page.locator('#quote-service')).toHaveValue('Campus Security');
 await expect(page.locator('#quote-dialog')).toBeVisible();
});

test('all pages expose the four new services through menus, footer and enquiry choices',async({page})=>{
 const titles=['Mobile Patrols','Alarm Services','Campus Security','Healthcare Security'];
 for(const route of ['/','/about/','/contact/']){
  await page.goto(route);
  await expect(page.locator('.mega-service')).toHaveCount(10);
  await expect(page.locator('footer .footer-services>button')).toHaveCount(4);
  await expect(page.locator('footer .footer-all-services')).toHaveAttribute('href','/#services');
  for(const title of titles){await expect(page.locator('.mega-services')).toContainText(title);}
  if(route!='/about/'){
   for(const title of titles) await expect(page.locator("#brief-form select")).toContainText(title);
  }
 }
 await page.goto('/');
 for(const [key,title] of [['mobile','Mobile Patrols'],['alarm','Alarm Services'],['campus','Campus Security'],['healthcare','Healthcare Security']]){
  await page.locator(`#service-${key} .service-link`).click();
  await expect(page.locator('#quote-service')).toHaveValue(title);
  await page.keyboard.press('Escape');
 }
});
