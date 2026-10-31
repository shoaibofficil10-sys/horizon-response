import {test,expect} from '@playwright/test';

test('compact header and desktop services show four cards then a second row',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 expect((await page.locator('.site-header').boundingBox()).height).toBe(74);
 const boxes=await page.locator('.service-card').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {top:r.top,left:r.left,width:r.width,height:r.height};}));
 for(const box of boxes.slice(0,4)) expect(Math.abs(box.top-boxes[0].top)).toBeLessThan(1);
 expect(boxes[5].top).toBeGreaterThan(boxes[0].top+boxes[0].height);
 expect(boxes[9].top).toBe(boxes[5].top);
 expect(Math.abs(boxes[5].left-boxes[0].left)).toBeLessThan(1);
 expect(await page.locator('.service-grid').evaluate(e=>getComputedStyle(e).scrollbarWidth)).toBe('none');
 expect(await page.locator('.service-grid').evaluate(e=>e.scrollWidth>e.clientWidth)).toBe(true);
 const nav=await page.locator('.service-selector').boundingBox();
 expect(nav.x+nav.width).toBeLessThan(boxes[0].left);
});

test('service text stays inside its inset panel and mobile rows scroll without a scrollbar',async({page})=>{
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  const results=await page.locator('.service-card').evaluateAll(cards=>cards.map(card=>{
   const panel=card.querySelector('.service-content').getBoundingClientRect(),title=card.querySelector('h3').getBoundingClientRect(),copy=card.querySelector('p').getBoundingClientRect(),button=card.querySelector('button').getBoundingClientRect(),box=card.getBoundingClientRect();
   return {titleFits:title.left>=panel.left&&title.right<=panel.right&&title.top>=panel.top,copyFits:copy.top>=title.bottom-1&&copy.right<=panel.right,buttonFits:button.top>=copy.bottom&&button.bottom<=panel.bottom,panelFits:panel.bottom<box.bottom&&panel.height<box.height*.65};
  }));
  expect(results.every(r=>Object.values(r).every(Boolean)),`Text overflow at ${width}`).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 expect((await page.locator('.site-header').boundingBox()).height).toBe(64);
 await page.locator('[data-service-slide="3"]').click();
 expect(await page.locator('.service-grid').evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
 await expect(page.locator('#service-current')).toHaveText('04');
});
