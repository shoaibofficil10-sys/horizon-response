import {test,expect} from '@playwright/test';

test('desktop mega menu opens on hover and stays open while entering its panel',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 const trigger=page.locator('.desktop-nav .mega-trigger');await trigger.hover();
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 await page.locator('.mega-service[data-service="campus"]').hover();
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 await page.locator('.mega-service[data-service="campus"]').click();
 await expect(page.locator('#dialog-title')).toHaveText('Campus Security');
 await page.getByRole('button',{name:'Include in my brief'}).click();
 await expect(page.locator('input[name=service]:checked')).toHaveValue('Campus Security');
});

test('all pages expose the four new services through menus, footer and enquiry choices',async({page})=>{
 const titles=['Mobile Patrols','Alarm Services','Campus Security','Healthcare Security'];
 for(const route of ['/','/about/','/contact/']){
  await page.goto(route);
  await expect(page.locator('.mega-service')).toHaveCount(10);
  await expect(page.locator('footer .footer-services>button')).toHaveCount(10);
  for(const title of titles){await expect(page.locator('footer .footer-services')).toContainText(title);}
  if(route!='/about/'){
   for(const title of titles) await expect(page.locator(`#brief-form input[value="${title}"]`)).toHaveCount(1);
  }
 }
 await page.goto('/');
 for(const [key,title] of [['mobile','Mobile Patrols'],['alarm','Alarm Services'],['campus','Campus Security'],['healthcare','Healthcare Security']]){
  await page.locator(`#service-${key} .service-link`).click();
  await expect(page.locator('#dialog-title')).toHaveText(title);
  await page.getByRole('button',{name:'Include in my brief'}).click();
  await expect(page.locator('input[name=service]:checked')).toHaveValue(title);
 }
});
