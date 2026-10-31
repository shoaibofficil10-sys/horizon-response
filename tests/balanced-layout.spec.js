import {test,expect} from '@playwright/test';

test('both service rows have five aligned cards at the start and end of scrolling',async({page})=>{
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await expect(page.locator('.service-tabs button')).toHaveCount(5);
  for(const end of [false,true]){
   await page.locator('.service-grid').evaluate((e,end)=>{e.scrollLeft=end?e.scrollWidth:0},end);
   const cards=await page.locator('.service-card').evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));
   for(let i=0;i<5;i++){
    expect(Math.abs(cards[i].x-cards[i+5].x)).toBeLessThan(1);
    expect(cards[i].w).toBe(cards[i+5].w);
    expect(cards[i].h).toBe(cards[i+5].h);
    expect(cards[i].y).toBe(cards[0].y);
    expect(cards[i+5].y).toBe(cards[5].y);
   }
  }
 }
});

test('footer panels align with a short service list and sidebar stays compact',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 for(const route of ['/','/about/','/contact/']){
  await page.goto(route);
  await expect(page.locator('.footer-services>button')).toHaveCount(4);
  await expect(page.locator('.footer-all-services')).toHaveAttribute('href','/#services');
  const panels=await page.locator('.footer-grid>.footer-card').evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect();return {y:r.y,b:r.bottom}}));
  for(const panel of panels){expect(Math.abs(panel.y-panels[0].y)).toBeLessThan(1);expect(Math.abs(panel.b-panels[0].b)).toBeLessThan(1);}
 }
 await page.goto('/');
 expect((await page.locator('.service-selector').boundingBox()).height).toBeLessThan(430);
});
